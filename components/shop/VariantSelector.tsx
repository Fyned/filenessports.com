'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { ProductVariant } from '@/types/database'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onSelect: (variant: ProductVariant) => void
}

interface GroupedVariants {
  [key: string]: {
    values: Array<{
      value: string
      variant: ProductVariant
    }>
  }
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  const [groupedVariants, setGroupedVariants] = useState<GroupedVariants>({})

  useEffect(() => {
    // Group variants by attribute type (e.g., size, color)
    const grouped: GroupedVariants = {}

    variants.forEach((variant) => {
      if (variant.attributes) {
        Object.entries(variant.attributes).forEach(([key, value]) => {
          if (!grouped[key]) {
            grouped[key] = { values: [] }
          }

          // Check if this value already exists
          const exists = grouped[key].values.some((v) => v.value === value)
          if (!exists) {
            grouped[key].values.push({ value, variant })
          }
        })
      } else if (variant.name) {
        // Fallback to variant name if no attributes
        if (!grouped['secenek']) {
          grouped['secenek'] = { values: [] }
        }
        grouped['secenek'].values.push({ value: variant.name, variant })
      }
    })

    setGroupedVariants(grouped)
  }, [variants])

  const getAttributeLabel = (key: string) => {
    const labels: Record<string, string> = {
      size: 'Beden',
      color: 'Renk',
      beden: 'Beden',
      renk: 'Renk',
      secenek: 'Seçenek',
    }
    return labels[key.toLowerCase()] || key
  }

  // If only one attribute type (like size only)
  if (Object.keys(groupedVariants).length === 1) {
    const [key, group] = Object.entries(groupedVariants)[0]

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{getAttributeLabel(key)}:</span>
          {selectedVariant && (
            <span className="text-[#BB1624]">{selectedVariant.name || selectedVariant.attributes?.[key]}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {group.values.map(({ value, variant }) => {
            const isSelected = selectedVariant?.id === variant.id
            const isOutOfStock = variant.stock === 0

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => !isOutOfStock && onSelect(variant)}
                disabled={isOutOfStock}
                className={cn(
                  'px-4 py-2 border rounded-lg text-sm font-medium transition-all',
                  isSelected
                    ? 'border-[#BB1624] bg-[#BB1624] text-white'
                    : 'border-gray-300 hover:border-[#1C2840]',
                  isOutOfStock && 'opacity-50 cursor-not-allowed line-through bg-gray-100'
                )}
              >
                {value}
                {variant.price && variant.price !== variants[0]?.price && (
                  <span className="ml-1 text-xs opacity-75">
                    (+{formatPrice(variant.price - (variants[0]?.price || 0))})
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Multiple attribute types (size + color, etc.)
  return (
    <div className="space-y-4">
      {Object.entries(groupedVariants).map(([key, group]) => (
        <div key={key} className="space-y-2">
          <span className="font-medium text-gray-700">{getAttributeLabel(key)}:</span>
          <div className="flex flex-wrap gap-2">
            {group.values.map(({ value, variant }) => {
              // For multi-attribute, we need more complex selection logic
              // For simplicity, we just check if current variant matches
              const isSelected = selectedVariant?.attributes?.[key] === value
              const isOutOfStock = variant.stock === 0

              // For colors, render as swatches
              if (key.toLowerCase() === 'color' || key.toLowerCase() === 'renk') {
                return (
                  <button
                    key={`${key}-${value}`}
                    type="button"
                    onClick={() => !isOutOfStock && onSelect(variant)}
                    disabled={isOutOfStock}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all relative',
                      isSelected
                        ? 'border-[#BB1624] ring-2 ring-[#BB1624] ring-offset-2'
                        : 'border-gray-300 hover:border-[#1C2840]',
                      isOutOfStock && 'opacity-50 cursor-not-allowed'
                    )}
                    style={{ backgroundColor: getColorCode(value) }}
                    title={value}
                  >
                    {isOutOfStock && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-red-500 rotate-45 transform" />
                      </span>
                    )}
                  </button>
                )
              }

              // Default: text buttons
              return (
                <button
                  key={`${key}-${value}`}
                  type="button"
                  onClick={() => !isOutOfStock && onSelect(variant)}
                  disabled={isOutOfStock}
                  className={cn(
                    'px-4 py-2 border rounded-lg text-sm font-medium transition-all',
                    isSelected
                      ? 'border-[#BB1624] bg-[#BB1624] text-white'
                      : 'border-gray-300 hover:border-[#1C2840]',
                    isOutOfStock && 'opacity-50 cursor-not-allowed line-through bg-gray-100'
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// Helper to convert color names to hex codes
function getColorCode(colorName: string): string {
  const colors: Record<string, string> = {
    // Turkish
    siyah: '#000000',
    beyaz: '#FFFFFF',
    kirmizi: '#DC2626',
    kırmızı: '#DC2626',
    mavi: '#2563EB',
    lacivert: '#1E3A5F',
    yesil: '#16A34A',
    yeşil: '#16A34A',
    sari: '#EAB308',
    sarı: '#EAB308',
    turuncu: '#EA580C',
    pembe: '#EC4899',
    mor: '#9333EA',
    gri: '#6B7280',
    kahverengi: '#92400E',
    bej: '#D4B896',
    // English
    black: '#000000',
    white: '#FFFFFF',
    red: '#DC2626',
    blue: '#2563EB',
    navy: '#1E3A5F',
    green: '#16A34A',
    yellow: '#EAB308',
    orange: '#EA580C',
    pink: '#EC4899',
    purple: '#9333EA',
    gray: '#6B7280',
    grey: '#6B7280',
    brown: '#92400E',
    beige: '#D4B896',
  }

  return colors[colorName.toLowerCase()] || '#9CA3AF'
}
