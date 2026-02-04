import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// GET - Tüm sayfaları getir
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Pages could not be fetched' }, { status: 500 })
  }
}

// POST - Yeni sayfa oluştur
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // Eğer bu sayfa ana sayfa olacaksa, diğer sayfaların is_homepage'ini false yap
    if (body.is_homepage) {
      await supabaseAdmin
        .from('pages')
        .update({ is_homepage: false })
        .eq('is_homepage', true)
    }

    // Slug kontrolü
    const { data: existingPage } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existingPage) {
      return NextResponse.json({ error: 'Bu slug zaten kullanılıyor' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from('pages').insert({
      title: body.title,
      slug: body.slug,
      is_homepage: body.is_homepage || false,
      is_published: body.is_published || false,
      published_at: body.is_published ? new Date().toISOString() : null,
    }).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Page could not be created' }, { status: 500 })
  }
}
