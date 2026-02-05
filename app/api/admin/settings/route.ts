import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// GET - Tüm ayarları getir
export async function GET() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Settings could not be fetched' }, { status: 500 })
  }
}

// POST - Ayarları kaydet
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

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
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 })
    }

    // Her ayarı tek tek kaydet
    for (const [key, value] of Object.entries(settings)) {
      const { error } = await supabaseAdmin
        .from('site_settings')
        .upsert({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'key' })

      if (error) {
        console.error(`Error saving setting ${key}:`, error)
        throw error
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Settings could not be saved' }, { status: 500 })
  }
}
