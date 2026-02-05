import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Create admin client - await required
    const supabaseAdmin = await getSupabaseAdmin()

    // 1. Kategoriyi bul
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (catError) {
      return NextResponse.json({
        step: 'category_fetch',
        error: catError.message,
        slug
      }, { status: 500 })
    }

    if (!category) {
      return NextResponse.json({
        step: 'category_not_found',
        slug
      }, { status: 404 })
    }

    // 2. Bu kategorideki ürünleri çek
    const { data: products, error: prodError, count } = await supabaseAdmin
      .from('products')
      .select(`
        id, name, slug, price, is_active, category_id,
        category:categories(id, name, slug),
        images:product_images(id, url, alt, is_primary)
      `, { count: 'exact' })
      .eq('category_id', category.id)
      .eq('is_active', true)

    if (prodError) {
      return NextResponse.json({
        step: 'products_fetch',
        error: prodError.message,
        category
      }, { status: 500 })
    }

    // 3. Ayrıca tüm ürünleri de kontrol et
    const { data: allProducts } = await supabaseAdmin
      .from('products')
      .select('id, name, category_id, is_active')

    return NextResponse.json({
      slug,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug
      },
      productCount: count,
      products: products?.map(p => ({
        id: p.id,
        name: p.name,
        category_id: p.category_id,
        is_active: p.is_active
      })),
      allProductsInDB: allProducts?.length,
      productsMatchingCategory: allProducts?.filter(p => p.category_id === category.id).length,
      activeProductsMatchingCategory: allProducts?.filter(p => p.category_id === category.id && p.is_active).length
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
