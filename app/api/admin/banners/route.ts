import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// GET - Tüm banner'ları getir
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('banners')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching banners:', error)
    return NextResponse.json({ error: 'Banners could not be fetched' }, { status: 500 })
  }
}

// POST - Yeni banner oluştur
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

    const { data, error } = await supabaseAdmin.from('banners').insert({
      title: body.title || null,
      subtitle: body.subtitle || null,
      image_url: body.image_url,
      mobile_image_url: body.mobile_image_url || null,
      link: body.link || null,
      button_text: body.button_text || null,
      position: body.position,
      sort_order: body.sort_order || 0,
      is_active: body.is_active ?? true,
      starts_at: body.starts_at || null,
      ends_at: body.ends_at || null,
      background_color: body.background_color || null,
      text_color: body.text_color || null,
    }).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating banner:', error)
    return NextResponse.json({ error: 'Banner could not be created' }, { status: 500 })
  }
}
