'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingCart, Star } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_price?: number | null
  images?: string[]
  short_description?: string
  is_new?: boolean
  is_featured?: boolean
}

interface CategoryProductBlockProps {
  title: string
  description: string
  products: Product[]
  categorySlug: string
  bgColor?: 'white' | 'gray'
}

export function CategoryProductBlock({
  title,
  description,
  products,
  categorySlug,
  bgColor = 'white',
}: CategoryProductBlockProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0] || '/images/placeholder.jpg',
      slug: product.slug,
    } as Parameters<typeof addItem>[0])
    toast.success(`${product.name} sepete eklendi!`)
  }

  const bgClass = bgColor === 'gray' ? 'bg-gray-50' : 'bg-white'

  return (
    <section className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2840] mb-2">
              {title}
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {description}
            </p>
          </div>
          <Link
            href={`/kategori/${categorySlug}`}
            className="inline-flex items-center gap-2 bg-[#166534] hover:bg-[#15803d] text-white px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap"
          >
            TÜMÜNÜ GÖR
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid - 4 columns */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Bu kategoride henüz ürün bulunmuyor.
          </div>
        )}
      </div>
    </section>
  )
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <Link href={`/urun/${product.slug}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl opacity-30">🥅</span>
            </div>
          )}

          {/* New Badge */}
          {product.is_new && (
            <span className="absolute top-3 left-3 bg-[#BB1624] text-white text-xs font-bold px-2 py-1 rounded">
              Yeni
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-semibold text-sm text-[#1C2840] line-clamp-2 mb-2 group-hover:text-[#166534] transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-3 h-3 text-gray-300" fill="currentColor" />
          ))}
        </div>

        {/* Price and Free Shipping */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-lg text-[#1C2840]">
              {product.price > 0 ? `${product.price.toLocaleString('tr-TR')} ₺` : 'Fiyat Sorunuz'}
            </span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.compare_price.toLocaleString('tr-TR')} ₺
              </span>
            )}
          </div>
          <span className="text-xs text-green-600 font-medium">
            Ücretsiz Kargo
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-[#166534] hover:bg-[#15803d] text-white py-2.5 rounded-lg font-semibold text-sm transition-all"
        >
          DETAYLI İNCELE
        </button>
      </div>
    </div>
  )
}
