'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Search, X, Loader2, TrendingUp, Clock, Package } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useDebounce } from '@/lib/hooks/useDebounce'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image_url: string | null
  category_name: string | null
}

interface SearchAutocompleteProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchAutocomplete({
  className,
  placeholder = 'Ürün ara...',
  onSearch,
}: SearchAutocompleteProps) {
  const router = useRouter()
  const supabase = createClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      setRecentSearches(JSON.parse(stored))
    }
  }, [])

  // Save search to recent
  const saveRecentSearch = (searchQuery: string) => {
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // Search products
  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          category:categories(name),
          images:product_images(url)
        `)
        .eq('is_active', true)
        .ilike('name', `%${searchQuery}%`)
        .limit(6)

      if (error) throw error

      const formattedResults: SearchResult[] = (data || []).map((product: any) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image_url: product.images?.[0]?.url || null,
        category_name: Array.isArray(product.category)
          ? product.category[0]?.name
          : product.category?.name || null,
      }))

      setResults(formattedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Run search when debounced query changes
  useEffect(() => {
    searchProducts(debouncedQuery)
  }, [debouncedQuery, searchProducts])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      saveRecentSearch(query.trim())
      setIsOpen(false)
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/urunler?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(result.name)
    setIsOpen(false)
    setQuery('')
  }

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery)
    setIsOpen(false)
    router.push(`/urunler?q=${encodeURIComponent(recentQuery)}`)
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 pr-10 py-2 w-full"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setResults([])
                inputRef.current?.focus()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-[400px] overflow-y-auto"
        >
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#BB1624]" />
            </div>
          )}

          {/* Search Results */}
          {!loading && results.length > 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 mb-2">Ürünler</p>
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={`/urunler/${result.slug}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition"
                >
                  {result.image_url ? (
                    <Image
                      src={result.image_url}
                      alt={result.name}
                      width={48}
                      height={48}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1C2840] line-clamp-1">
                      {result.name}
                    </p>
                    {result.category_name && (
                      <p className="text-xs text-gray-500">{result.category_name}</p>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[#BB1624]">
                    {formatPrice(result.price)}
                  </span>
                </Link>
              ))}

              {/* View all results */}
              <button
                onClick={handleSubmit}
                className="w-full mt-2 p-2 text-center text-sm text-[#BB1624] hover:bg-red-50 rounded-lg transition"
              >
                Tüm sonuçları gör ({query})
              </button>
            </div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-gray-500">Sonuç bulunamadı</p>
              <p className="text-sm text-gray-400 mt-1">
                Farklı bir arama terimi deneyin
              </p>
            </div>
          )}

          {/* Recent Searches */}
          {!loading && !query && recentSearches.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Son Aramalar
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Temizle
                </button>
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(recent)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{recent}</span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Searches (when no query and no recent) */}
          {!loading && !query && recentSearches.length === 0 && (
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Popüler Aramalar
              </p>
              {['Ayakkabı', 'Forma', 'Eşofman', 'Çanta'].map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(term)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg text-left"
                >
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
