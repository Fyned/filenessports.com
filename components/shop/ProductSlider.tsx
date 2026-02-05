'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

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

interface ProductSliderProps {
  title: string
  products: Product[]
  categorySlug?: string
  categoryName?: string
  bgColor?: 'white' | 'gray'
}

export function ProductSlider({
  title,
  products,
  categorySlug,
  categoryName,
  bgColor = 'white'
}: ProductSliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)

  if (products.length === 0) {
    return null
  }

  return (
    <section className={`py-12 ${bgColor === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1C2840]">{title}</h2>
            {categoryName && (
              <p className="text-gray-600 mt-1">{categoryName} kategorisindeki ürünlerimiz</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Navigation Buttons */}
            <button
              ref={prevRef}
              className="w-10 h-10 rounded-full border-2 border-[#1C2840] flex items-center justify-center hover:bg-[#1C2840] hover:text-white transition-colors text-[#1C2840]"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              ref={nextRef}
              className="w-10 h-10 rounded-full border-2 border-[#1C2840] flex items-center justify-center hover:bg-[#1C2840] hover:text-white transition-colors text-[#1C2840]"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {categorySlug && (
              <Link href={`/kategori/${categorySlug}`}>
                <Button variant="outline" className="hidden sm:flex items-center gap-2 border-[#BB1624] text-[#BB1624] hover:bg-[#BB1624] hover:text-white">
                  Tümünü Gör
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="!overflow-visible"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Mobile View All Button */}
        {categorySlug && (
          <div className="mt-6 text-center sm:hidden">
            <Link href={`/kategori/${categorySlug}`}>
              <Button className="bg-[#BB1624] hover:bg-[#8F101B] w-full">
                Tümünü Gör
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images?.[0] || '/images/placeholder-product.jpg'
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  return (
    <Link href={`/urun/${product.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                YENİ
              </span>
            )}
            {hasDiscount && (
              <span className="bg-[#BB1624] text-white text-xs font-bold px-2 py-1 rounded">
                %{discountPercent} İndirim
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-[#1C2840] text-sm line-clamp-2 min-h-[40px] group-hover:text-[#BB1624] transition-colors">
            {product.name}
          </h3>

          {product.short_description && (
            <p className="text-gray-500 text-xs mt-1 line-clamp-1">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="mt-3 flex items-center gap-2">
            {product.price > 0 ? (
              <>
                <span className="text-lg font-bold text-[#BB1624]">
                  {product.price.toLocaleString('tr-TR')} TL
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {product.compare_price!.toLocaleString('tr-TR')} TL
                  </span>
                )}
              </>
            ) : (
              <span className="text-lg font-bold text-[#1C2840]">
                Fiyat İçin Arayın
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full mt-3 bg-[#1C2840] hover:bg-[#BB1624] text-sm"
            onClick={(e) => {
              e.preventDefault()
              // Navigate to product page
              window.location.href = `/urun/${product.slug}`
            }}
          >
            Ürünü İncele
          </Button>
        </div>
      </div>
    </Link>
  )
}
