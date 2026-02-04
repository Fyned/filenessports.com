'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/types/database'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  showAddToCart?: boolean
}

export function ProductCard({ product, showAddToCart = false }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    toast.success('Ürün sepete eklendi', {
      description: product.name,
      action: {
        label: 'Sepete Git',
        onClick: () => window.location.href = '/sepet'
      }
    })
  }

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
    >
      <div className="relative aspect-square bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Görsel Yok
          </div>
        )}
        {product.is_new && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
            Yeni
          </span>
        )}
        {product.compare_price && product.compare_price > product.price && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            %{Math.round((1 - product.price / product.compare_price) * 100)} İndirim
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 px-3 py-1 rounded font-medium">
              Tükendi
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 group-hover:text-[#BB1624] transition line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-[#BB1624]">
            {product.price.toLocaleString('tr-TR')} TL
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {product.compare_price.toLocaleString('tr-TR')} TL
            </span>
          )}
        </div>
        {showAddToCart && product.stock > 0 && (
          <Button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-[#BB1624] hover:bg-[#8F101B]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sepete Ekle
          </Button>
        )}
      </div>
    </Link>
  )
}
