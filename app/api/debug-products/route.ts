import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        images:product_images(id, url, alt, is_primary)
      `, { count: 'exact' })
      .eq('is_active', true)

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({
      count,
      products: data?.map(p => ({
        id: p.id,
        name: p.name,
        is_active: p.is_active,
        category: p.category,
        images: p.images
      }))
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
