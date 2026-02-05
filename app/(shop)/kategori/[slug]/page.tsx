import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { ProductCard } from '@/components/shop/ProductCard'
import { Product, Category } from '@/types/database'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { CategorySortSelect } from './SortSelect'
import { Package, ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ siralama?: string; sayfa?: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabaseAdmin = await getSupabaseAdmin()

  const { data: category } = await supabaseAdmin
    .from('categories')
    .select('name, description, meta_title, meta_description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!category) {
    return { title: 'Kategori Bulunamadı - Filenes Sports' }
  }

  return {
    title: category.meta_title || `${category.name} - Filenes Sports`,
    description: category.meta_description || category.description || '',
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params
  const search = await searchParams
  const supabase = await getSupabaseAdmin()

  // Fetch category
  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  console.log('Category fetch:', { slug, category: category?.name, catError })

  if (!category) {
    notFound()
  }

  const page = parseInt(search.sayfa || '1')
  const perPage = 12
  const offset = (page - 1) * perPage

  // Fetch subcategories
  const { data: subcategories } = await supabase
    .from('categories')
    .select('*')
    .eq('parent_id', category.id)
    .eq('is_active', true)
    .order('sort_order')

  // Fetch products
  const { data: products, error: prodError, count } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary)
    `, { count: 'exact' })
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  console.log('Products fetch:', {
    categoryId: category.id,
    count,
    productsLength: products?.length,
    prodError,
    firstProduct: products?.[0]?.name
  })

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#BB1624]">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/urunler" className="hover:text-[#BB1624]">Ürünler</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-[#1C2840] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            {category.image && (
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/10">
                <Image
                  src={category.image}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-gray-300 mt-2 max-w-2xl">{category.description}</p>
              )}
              <p className="text-[#BB1624] font-medium mt-2">{count || 0} ürün</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {subcategories && subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Grid3X3 className="w-5 h-5 text-[#BB1624]" />
              Alt Kategoriler
            </h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((sub: Category) => (
                <Link
                  key={sub.id}
                  href={`/kategori/${sub.slug}`}
                  className="px-4 py-2 bg-white rounded-lg border hover:border-[#BB1624] hover:text-[#BB1624] transition-colors shadow-sm"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sort & Filter Bar */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
          <span className="text-sm text-gray-600">
            Sayfa {page} / {totalPages || 1}
          </span>
          <Suspense fallback={<div className="w-48 h-10 bg-gray-100 rounded-lg animate-pulse" />}>
            <CategorySortSelect defaultValue={search.siralama || ''} />
          </Suspense>
        </div>

        {/* Products Grid */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as Product} showAddToCart />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">Bu kategoride henüz ürün bulunmuyor.</p>
            <p className="text-gray-500 text-sm mb-6">Yakında yeni ürünler eklenecek!</p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-[#BB1624] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#8F101B] transition-colors"
            >
              Tüm Ürünleri Görüntüle
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/kategori/${slug}?sayfa=${page - 1}${search.siralama ? `&siralama=${search.siralama}` : ''}`}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Önceki
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
              .map((p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) {
                  return (
                    <span key={`ellipsis-${p}`} className="flex items-center gap-2">
                      <span className="px-2 text-gray-400">...</span>
                      <Link
                        href={`/kategori/${slug}?sayfa=${p}${search.siralama ? `&siralama=${search.siralama}` : ''}`}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          p === page
                            ? 'bg-[#BB1624] text-white border-[#BB1624]'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </Link>
                    </span>
                  )
                }
                return (
                  <Link
                    key={p}
                    href={`/kategori/${slug}?sayfa=${p}${search.siralama ? `&siralama=${search.siralama}` : ''}`}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      p === page
                        ? 'bg-[#BB1624] text-white border-[#BB1624]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                )
              })}

            {page < totalPages && (
              <Link
                href={`/kategori/${slug}?sayfa=${page + 1}${search.siralama ? `&siralama=${search.siralama}` : ''}`}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
              >
                Sonraki
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
