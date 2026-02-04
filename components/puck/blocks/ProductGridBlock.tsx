'use client'

import { ComponentConfig } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Product } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'

export type ProductGridBlockProps = {
  title: string
  categorySlug: string
  limit: number
  columns: 2 | 3 | 4
  showPrice: boolean
  showButton: boolean
  featuredOnly: boolean
}

function ProductGridRenderer({
  title,
  categorySlug,
  limit,
  columns,
  showPrice,
  showButton,
  featuredOnly,
}: ProductGridBlockProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createClient()
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, slug),
          images:product_images(id, url, alt, is_primary)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (categorySlug) {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()

        if (category) {
          query = query.eq('category_id', category.id)
        }
      }

      if (featuredOnly) {
        query = query.eq('is_featured', true)
      }

      const { data } = await query
      setProducts((data as Product[]) || [])
      setLoading(false)
    }

    fetchProducts()
  }, [categorySlug, limit, featuredOnly])

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className={`grid ${gridCols[columns]} gap-6`}>
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {products.map((product) => {
            const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0]

            return (
              <Link
                key={product.id}
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
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Gorsel Yok
                    </div>
                  )}
                  {product.is_new && (
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                      Yeni
                    </span>
                  )}
                  {product.compare_price && product.compare_price > product.price && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      %{Math.round((1 - product.price / product.compare_price) * 100)} Indirim
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 group-hover:text-emerald-600 transition line-clamp-2">
                    {product.name}
                  </h3>
                  {showPrice && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-lg font-bold text-emerald-600">
                        {product.price.toLocaleString('tr-TR')} TL
                      </span>
                      {product.compare_price && product.compare_price > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {product.compare_price.toLocaleString('tr-TR')} TL
                        </span>
                      )}
                    </div>
                  )}
                  {showButton && (
                    <button className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition">
                      Detayi Gor
                    </button>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export const ProductGridBlock: ComponentConfig<ProductGridBlockProps> = {
  label: 'Urun Grid',
  fields: {
    title: {
      type: 'text',
      label: 'Baslik',
    },
    categorySlug: {
      type: 'text',
      label: 'Kategori Slug (bos = tum urunler)',
    },
    limit: {
      type: 'number',
      label: 'Urun Sayisi',
      min: 1,
      max: 20,
    },
    columns: {
      type: 'select',
      label: 'Sutun Sayisi',
      options: [
        { label: '2 Sutun', value: 2 },
        { label: '3 Sutun', value: 3 },
        { label: '4 Sutun', value: 4 },
      ],
    },
    showPrice: {
      type: 'radio',
      label: 'Fiyat Goster',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
    showButton: {
      type: 'radio',
      label: 'Detay Butonu',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
    featuredOnly: {
      type: 'radio',
      label: 'Sadece One Cikan',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
  },
  defaultProps: {
    title: 'Urunlerimiz',
    categorySlug: '',
    limit: 8,
    columns: 4,
    showPrice: true,
    showButton: true,
    featuredOnly: false,
  },
  render: ProductGridRenderer,
}
