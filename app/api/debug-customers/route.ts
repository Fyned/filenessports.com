import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

    // Customers tablosundaki tüm kayıtları çek
    const { data: customers, error: custError } = await supabaseAdmin
      .from('customers')
      .select('*')

    // auth.users tablosunu da kontrol et
    const { data: authUsers, error: authError } = await supabaseAdmin
      .auth.admin.listUsers()

    // profiles tablosu var mı kontrol et
    const { data: profiles, error: profError } = await supabaseAdmin
      .from('profiles')
      .select('*')

    return NextResponse.json({
      customers: {
        count: customers?.length || 0,
        error: custError?.message || null,
        data: customers
      },
      authUsers: {
        count: authUsers?.users?.length || 0,
        error: authError?.message || null,
        data: authUsers?.users?.map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))
      },
      profiles: {
        count: profiles?.length || 0,
        error: profError?.message || null,
        data: profiles
      }
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
