import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

    // Get one product with all columns
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message })
    }

    return NextResponse.json({
      columns: Object.keys(product || {}),
      sample: product
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
