'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Slider } from '@/components/ui/slider'
import { Filter, X, RotateCcw } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  maxPrice: number
  className?: string
}

export function ProductFilters({ categories, maxPrice, className }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse current filters from URL
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('min_price')) || 0,
    Number(searchParams.get('max_price')) || maxPrice,
  ])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  )
  const [inStock, setInStock] = useState(searchParams.get('in_stock') === 'true')
  const [onSale, setOnSale] = useState(searchParams.get('on_sale') === 'true')
  const [isNew, setIsNew] = useState(searchParams.get('is_new') === 'true')
  const [freeShipping, setFreeShipping] = useState(searchParams.get('free_shipping') === 'true')

  // Track if filters are dirty
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    inStock ||
    onSale ||
    isNew ||
    freeShipping

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Price range
    if (priceRange[0] > 0) {
      params.set('min_price', priceRange[0].toString())
    } else {
      params.delete('min_price')
    }

    if (priceRange[1] < maxPrice) {
      params.set('max_price', priceRange[1].toString())
    } else {
      params.delete('max_price')
    }

    // Categories
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','))
    } else {
      params.delete('categories')
    }

    // Boolean filters
    if (inStock) params.set('in_stock', 'true')
    else params.delete('in_stock')

    if (onSale) params.set('on_sale', 'true')
    else params.delete('on_sale')

    if (isNew) params.set('is_new', 'true')
    else params.delete('is_new')

    if (freeShipping) params.set('free_shipping', 'true')
    else params.delete('free_shipping')

    // Reset to first page
    params.delete('page')

    router.push(`/urunler?${params.toString()}`)
  }

  const clearFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setInStock(false)
    setOnSale(false)
    setIsNew(false)
    setFreeShipping(false)

    // Keep only search query if exists
    const q = searchParams.get('q')
    router.push(q ? `/urunler?q=${q}` : '/urunler')
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#1C2840] flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtreler
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-[#BB1624] flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            Temizle
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['price', 'categories', 'status']} className="space-y-2">
        {/* Price Range */}
        <AccordionItem value="price" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-3">
            Fiyat Aralığı
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                min={0}
                max={maxPrice}
                step={10}
                className="mt-2"
              />
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Min</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    min={0}
                    max={priceRange[1]}
                    className="h-8 text-sm"
                  />
                </div>
                <span className="text-gray-400 pt-5">-</span>
                <div className="flex-1">
                  <Label className="text-xs text-gray-500">Max</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    min={priceRange[0]}
                    max={maxPrice}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        {categories.length > 0 && (
          <AccordionItem value="categories" className="border-b">
            <AccordionTrigger className="text-sm font-medium py-3">
              Kategoriler
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <label
                      htmlFor={`cat-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Status Filters */}
        <AccordionItem value="status" className="border-b">
          <AccordionTrigger className="text-sm font-medium py-3">
            Ürün Durumu
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in_stock"
                  checked={inStock}
                  onCheckedChange={(checked) => setInStock(checked as boolean)}
                />
                <label htmlFor="in_stock" className="text-sm cursor-pointer">
                  Stokta Olanlar
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="on_sale"
                  checked={onSale}
                  onCheckedChange={(checked) => setOnSale(checked as boolean)}
                />
                <label htmlFor="on_sale" className="text-sm cursor-pointer">
                  İndirimli Ürünler
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_new"
                  checked={isNew}
                  onCheckedChange={(checked) => setIsNew(checked as boolean)}
                />
                <label htmlFor="is_new" className="text-sm cursor-pointer">
                  Yeni Ürünler
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free_shipping"
                  checked={freeShipping}
                  onCheckedChange={(checked) => setFreeShipping(checked as boolean)}
                />
                <label htmlFor="free_shipping" className="text-sm cursor-pointer">
                  Ücretsiz Kargo
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Apply Button */}
      <Button
        onClick={applyFilters}
        className="w-full mt-4 bg-[#BB1624] hover:bg-[#8F101B]"
      >
        Filtreleri Uygula
      </Button>
    </div>
  )
}
