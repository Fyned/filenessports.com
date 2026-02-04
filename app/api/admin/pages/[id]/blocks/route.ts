import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET - Sayfa bloklarını getir
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('page_blocks')
      .select('puck_data')
      .eq('page_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error
    }

    return NextResponse.json(data || { puck_data: null })
  } catch (error) {
    console.error('Error fetching page blocks:', error)
    return NextResponse.json({ error: 'Page blocks could not be fetched' }, { status: 500 })
  }
}

// POST - Sayfa bloklarını kaydet
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Kullanıcının admin olup olmadığını kontrol et
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Admin kontrolü
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json()
    const { puck_data, is_draft = false, is_published = false } = body

    // Check if page_blocks exists for this page
    const { data: existingBlock } = await supabaseAdmin
      .from('page_blocks')
      .select('id')
      .eq('page_id', id)
      .single()

    if (existingBlock) {
      // Update existing block
      const { error } = await supabaseAdmin
        .from('page_blocks')
        .update({
          puck_data,
          is_draft,
          updated_at: new Date().toISOString(),
        })
        .eq('page_id', id)

      if (error) throw error
    } else {
      // Create new block
      const { error } = await supabaseAdmin.from('page_blocks').insert({
        page_id: id,
        puck_data,
        is_draft,
      })

      if (error) throw error
    }

    // Update page if publishing
    if (is_published) {
      await supabaseAdmin
        .from('pages')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving page blocks:', error)
    return NextResponse.json({ error: 'Page blocks could not be saved' }, { status: 500 })
  }
}
