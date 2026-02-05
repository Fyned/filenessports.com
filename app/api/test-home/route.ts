import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabaseAdmin = await getSupabaseAdmin()

    // Test categories
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, description')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    // Test products for kale-fileleri
    const kaleCategory = categories?.find(c => c.slug === 'kale-fileleri')

    let kaleProducts = null
    let prodError = null

    if (kaleCategory) {
      const result = await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, compare_price, images, short_description, is_new, is_featured')
        .eq('is_active', true)
        .eq('category_id', kaleCategory.id)
        .order('created_at', { ascending: false })
        .limit(8)

      kaleProducts = result.data
      prodError = result.error
    }

    return NextResponse.json({
      categoriesCount: categories?.length || 0,
      categoriesError: catError?.message || null,
      categories: categories?.map(c => ({ id: c.id, slug: c.slug, name: c.name })),
      kaleCategory: kaleCategory ? { id: kaleCategory.id, slug: kaleCategory.slug } : null,
      kaleProductsCount: kaleProducts?.length || 0,
      kaleProductsError: prodError?.message || null,
      kaleProducts: kaleProducts?.slice(0, 3).map(p => ({ id: p.id, name: p.name }))
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
