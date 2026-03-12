'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Package } from 'lucide-react'

interface ProductImage {
  id: string
  url: string
  alt: string | null
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  isNew?: boolean
  discountPercent?: number
}

export function ProductImageGallery({ images, productName, isNew, discountPercent }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const currentImage = images[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
        {currentImage ? (
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
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
          {isNew && (
            <span className="bg-[#1C2840] text-white text-xs px-3 py-1 rounded-full font-medium">
              Yeni
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-[#BB1624] text-white text-xs px-3 py-1 rounded-full font-medium">
              %{discountPercent} İndirim
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm transition-all ${
                index === selectedIndex
                  ? 'ring-2 ring-[#BB1624]'
                  : 'hover:ring-2 ring-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                className="object-contain p-2"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
