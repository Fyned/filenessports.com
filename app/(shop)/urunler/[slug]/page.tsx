import { createClient } from '@/lib/supabase/server'
import { Product } from '@/types/database'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ProductCard } from '@/components/shop/ProductCard'
import { AddToCartButton } from './AddToCartButton'
import { ProductReviews } from '@/components/shop/ProductReviews'
import { StarRating } from '@/components/shop/StarRating'
import { WishlistButton } from '@/components/shop/WishlistButton'
import { Truck, RotateCcw, Shield, Check, Package, Star } from 'lucide-react'
import { getSiteSettings } from '@/lib/settings'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, short_description, meta_title, meta_description')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    return { title: 'Ürün Bulunamadı - Filenes Sports' }
  }

  return {
    title: product.meta_title || `${product.name} - Filenes Sports`,
    description: product.meta_description || product.short_description || '',
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const settings = await getSiteSettings()

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary, sort_order),
      variants:product_variants(id, name, sku, price, stock, attributes, image_url, is_active)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  // Fetch review stats
  const { data: reviewStats } = await supabase
    .from('product_reviews')
    .select('rating')
    .eq('product_id', product?.id || '')
    .eq('is_approved', true)

  const reviewCount = reviewStats?.length || 0
  const averageRating = reviewCount > 0
    ? reviewStats!.reduce((sum, r) => sum + r.rating, 0) / reviewCount
    : 0

  if (!product) {
    notFound()
  }

  // Sort images
  const sortedImages = product.images?.sort((a: { sort_order: number; is_primary: boolean }, b: { sort_order: number; is_primary: boolean }) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.sort_order - b.sort_order
  }) || []

  // Fetch related products
  const { data: relatedProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary)
    `)
    .eq('category_id', product.category_id)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(4)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-[#BB1624]">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href="/urunler" className="hover:text-[#BB1624]">Ürünler</Link>
            {product.category && (
              <>
                <span className="mx-2">/</span>
                <Link href={`/kategori/${product.category.slug}`} className="hover:text-[#BB1624]">
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
              {sortedImages[0] ? (
                <Image
                  src={sortedImages[0].url}
                  alt={sortedImages[0].alt || product.name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <Package className="w-20 h-20 mb-2" />
                  <span>Görsel Yok</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="bg-[#1C2840] text-white text-xs px-3 py-1 rounded-full font-medium">
                    Yeni
                  </span>
                )}
                {product.compare_price && product.compare_price > product.price && (
                  <span className="bg-[#BB1624] text-white text-xs px-3 py-1 rounded-full font-medium">
                    %{Math.round((1 - product.price / product.compare_price) * 100)} İndirim
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {sortedImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {sortedImages.map((image: { id: string; url: string; alt: string | null }) => (
                  <div
                    key={image.id}
                    className="relative aspect-square bg-white rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#BB1624] shadow-sm transition-all"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            {/* Category */}
            {product.category && (
              <Link
                href={`/kategori/${product.category.slug}`}
                className="text-sm text-[#BB1624] font-medium hover:underline mb-2 inline-block"
              >
                {product.category.name}
              </Link>
            )}

            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
              <WishlistButton productId={product.id} className="flex-shrink-0" />
            </div>

            {/* Rating */}
            {reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={averageRating} size="sm" />
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({reviewCount} değerlendirme)
                </span>
              </div>
            )}

            {product.sku && (
              <p className="text-sm text-gray-500 mb-4">Ürün Kodu: {product.sku}</p>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#BB1624]">
                  {product.price.toLocaleString('tr-TR')} TL
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {product.compare_price.toLocaleString('tr-TR')} TL
                  </span>
                )}
              </div>
              {product.free_shipping && (
                <div className="flex items-center gap-2 mt-2 text-green-600 text-sm">
                  <Truck className="w-4 h-4" />
                  <span>Ücretsiz Kargo</span>
                </div>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 mb-6">{product.short_description}</p>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Stokta ({product.stock} adet)</span>
                </div>
              ) : (
                <span className="text-red-600 font-medium">Stokta Yok</span>
              )}
            </div>

            {/* Add to Cart */}
            <AddToCartButton product={product as Product} />

            {/* Features */}
            <div className="mt-8 pt-6 border-t space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-[#1C2840]" />
                </div>
                <span>{settings.free_shipping_threshold} TL üzeri siparişlerde ücretsiz kargo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-5 h-5 text-[#1C2840]" />
                </div>
                <span>14 gün içinde koşulsuz iade hakkı</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#1C2840]" />
                </div>
                <span>256-bit SSL ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mb-12 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Ürün Açıklaması</h2>
            <div
              className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#BB1624]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        )}

        {/* Product Reviews */}
        <div className="mb-12 bg-white rounded-xl p-6 shadow-sm">
          <ProductReviews productId={product.id} productName={product.name} />
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">İlgili Ürünler</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct as Product} showAddToCart />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
