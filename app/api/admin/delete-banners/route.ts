import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function DELETE() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

    // Tüm banner'ları sil
    const { error } = await supabaseAdmin
      .from('banners')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Tüm kayıtları sil

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Tüm banner kayıtları silindi' })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
