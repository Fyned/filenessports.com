import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Tüm kategorileri çek
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, is_active')
      .order('sort_order')

    // Tüm ürünleri çek
    const { data: products, error: prodError, count } = await supabase
      .from('products')
      .select(`
        id, name, slug, is_active, category_id,
        category:categories(id, name, slug)
      `, { count: 'exact' })

    if (catError || prodError) {
      return NextResponse.json({
        error: catError?.message || prodError?.message,
        details: { catError, prodError }
      }, { status: 500 })
    }

    // Kategori bazında ürün sayısı
    const categoryStats = categories?.map(cat => ({
      ...cat,
      productCount: products?.filter(p => p.category_id === cat.id).length || 0,
      activeProductCount: products?.filter(p => p.category_id === cat.id && p.is_active).length || 0
    }))

    return NextResponse.json({
      totalProducts: count,
      activeProducts: products?.filter(p => p.is_active).length,
      categories: categoryStats,
      products: products?.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        is_active: p.is_active,
        category_id: p.category_id,
        category: p.category
      }))
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
