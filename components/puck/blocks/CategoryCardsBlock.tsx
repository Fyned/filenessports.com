'use client'

import { ComponentConfig } from '@puckeditor/core'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'

export type CategoryCardsBlockProps = {
  title: string
  showDescription: boolean
  layout: 'grid' | 'carousel'
  limit: number
}

function CategoryCardsRenderer({
  title,
  showDescription,
  layout,
  limit,
}: CategoryCardsBlockProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order')
        .limit(limit)

      setCategories((data as Category[]) || [])
      setLoading(false)
    }

    fetchCategories()
  }, [limit])

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse" />
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
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : 'flex overflow-x-auto gap-6 pb-4 snap-x'
          }
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className={`group relative rounded-lg overflow-hidden ${
                layout === 'carousel' ? 'min-w-[250px] snap-start' : ''
              }`}
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700">
                    <span className="text-white text-lg font-semibold">{category.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold text-center">{category.name}</h3>
                  {showDescription && category.description && (
                    <p className="text-sm text-white/80 mt-2 text-center line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export const CategoryCardsBlock: ComponentConfig<CategoryCardsBlockProps> = {
  label: 'Kategori Kartlari',
  fields: {
    title: {
      type: 'text',
      label: 'Baslik',
    },
    showDescription: {
      type: 'radio',
      label: 'Aciklama Goster',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
    layout: {
      type: 'select',
      label: 'Layout',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    limit: {
      type: 'number',
      label: 'Kategori Sayisi',
      min: 1,
      max: 10,
    },
  },
  defaultProps: {
    title: 'Kategoriler',
    showDescription: false,
    layout: 'grid',
    limit: 6,
  },
  render: CategoryCardsRenderer,
}
