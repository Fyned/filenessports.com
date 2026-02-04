import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'
import { Product, Category } from '@/types/database'
import { Metadata } from 'next'
import Link from 'next/link'
import { SortSelect } from './SortSelect'
import { Suspense } from 'react'
import { Package, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tüm Ürünler - Filenes Sports',
  description: 'Spor fileleri, güvenlik fileleri ve daha fazlasını keşfedin.',
}

interface ProductsPageProps {
  searchParams: Promise<{ q?: string; kategori?: string; siralama?: string; sayfa?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const page = parseInt(params.sayfa || '1')
  const perPage = 12
  const offset = (page - 1) * perPage

  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary)
    `, { count: 'exact' })
    .eq('is_active', true)

  // Search filter
  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  // Category filter
  if (params.kategori) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.kategori)
      .single()

    if (category) {
      query = query.eq('category_id', category.id)
    }
  }

  // Sorting
  switch (params.siralama) {
    case 'fiyat-artan':
      query = query.order('price', { ascending: true })
      break
    case 'fiyat-azalan':
      query = query.order('price', { ascending: false })
      break
    case 'yeni':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  // Pagination
  query = query.range(offset, offset + perPage - 1)

  const { data: products, count, error } = await query

  // Debug log
  console.log('Products query result:', { count, error: error?.message, productsCount: products?.length })

  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .eq('is_active', true)
    .order('sort_order')

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#BB1624]">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Ürünler</span>
            {params.kategori && (
              <>
                <span className="mx-2">/</span>
                <span className="text-[#BB1624]">{params.kategori}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {params.q ? `"${params.q}" için arama sonuçları` : 'Tüm Ürünler'}
          </h1>
          <p className="text-gray-600 mt-2">
            {count || 0} ürün bulundu
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#BB1624]" />
                Kategoriler
              </h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/urunler"
                    className={`block py-2 px-3 rounded-lg transition-colors ${
                      !params.kategori
                        ? 'bg-[#BB1624] text-white font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tümü
                  </Link>
                </li>
                {categories?.map((category: Category) => (
                  <li key={category.id}>
                    <Link
                      href={`/urunler?kategori=${category.slug}`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${
                        params.kategori === category.slug
                          ? 'bg-[#BB1624] text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
              <span className="text-sm text-gray-600">
                Sayfa {page} / {totalPages || 1}
              </span>
              <Suspense fallback={<div className="w-48 h-10 bg-gray-100 rounded-lg animate-pulse" />}>
                <SortSelect defaultValue={params.siralama || ''} />
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
                <p className="text-gray-600 text-lg">Ürün bulunamadı.</p>
                <Link
                  href="/urunler"
                  className="text-[#BB1624] hover:underline mt-4 inline-block font-medium"
                >
                  Tüm ürünleri görüntüle
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/urunler?sayfa=${page - 1}${params.kategori ? `&kategori=${params.kategori}` : ''}${params.siralama ? `&siralama=${params.siralama}` : ''}`}
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
                            href={`/urunler?sayfa=${p}${params.kategori ? `&kategori=${params.kategori}` : ''}${params.siralama ? `&siralama=${params.siralama}` : ''}`}
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
                        href={`/urunler?sayfa=${p}${params.kategori ? `&kategori=${params.kategori}` : ''}${params.siralama ? `&siralama=${params.siralama}` : ''}`}
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
                    href={`/urunler?sayfa=${page + 1}${params.kategori ? `&kategori=${params.kategori}` : ''}${params.siralama ? `&siralama=${params.siralama}` : ''}`}
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
      </div>
    </div>
  )
}
