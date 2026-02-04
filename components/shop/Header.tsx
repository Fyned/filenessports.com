'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Search, ShoppingCart, User, Menu, X, Phone, Mail, MapPin, Truck, Shield, Headphones } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useUIStore } from '@/stores/ui-store'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types/database'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface HeaderProps {
  freeShippingThreshold?: number
}

export function Header({ freeShippingThreshold = 500 }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const itemCount = useCartStore((state) => state.getItemCount())

  // Hydration fix
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order')
        .limit(8)

      setCategories((data as Category[]) || [])
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/urunler?q=${encodeURIComponent(searchQuery)}`
    }
  }

  // Header height hesapla (Top bar + Main header + Nav)
  const headerHeight = isScrolled ? 130 : 0 // Fixed olduğunda approximate height

  return (
    <>
      {/* Spacer div - fixed header olduğunda content kaymasını önler */}
      {isScrolled && <div style={{ height: headerHeight }} />}

      <header className="relative z-50">
        {/* Top Info Bar */}
        <div className="bg-[#1C2840] text-white text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Left - Contact Info */}
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:08503023262" className="flex items-center gap-2 hover:text-[#BB1624] transition-colors">
                <Phone className="w-4 h-4" />
                <span>0850 302 32 62</span>
              </a>
              <a href="mailto:info@fileenessports.com" className="flex items-center gap-2 hover:text-[#BB1624] transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@fileenessports.com</span>
              </a>
            </div>

            {/* Center - Promo */}
            <div className="flex-1 text-center">
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-[#BB1624]" />
                <span className="font-medium">{freeShippingThreshold.toLocaleString('tr-TR')} TL ve üzeri siparişlerde <span className="text-[#BB1624]">ÜCRETSİZ KARGO!</span></span>
              </div>
            </div>

            {/* Right - Account Links */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/hesabim" className="hover:text-[#BB1624] transition-colors">
                Hesabım
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/siparis-takip" className="hover:text-[#BB1624] transition-colors">
                Sipariş Takip
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 shadow-lg' : 'relative'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 gap-8">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.svg"
                alt="Filenes Sports"
                width={200}
                height={67}
                className="h-14 w-auto"
                priority
              />
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-2xl">
              <div className="relative w-full">
                <Input
                  type="search"
                  placeholder="Ürün, kategori veya marka ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-5 pr-14 rounded-full border-2 border-gray-200 focus:border-[#1C2840] bg-gray-50 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#BB1624] hover:bg-[#8F101B] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search - Mobile */}
              <Sheet>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Ara">
                    <Search className="w-6 h-6 text-[#1C2840]" />
                  </button>
                </SheetTrigger>
                <SheetContent side="top" className="bg-[#1C2840]">
                  <SheetHeader>
                    <SheetTitle className="text-white">Ürün Ara</SheetTitle>
                  </SheetHeader>
                  <form onSubmit={handleSearch} className="mt-4">
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder="Ürün, kategori veya marka ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-5 pr-14 rounded-full"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#BB1624] text-white w-10 h-10 rounded-full flex items-center justify-center"
                      >
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </SheetContent>
              </Sheet>

              {/* Account */}
              <Link
                href="/hesabim"
                className="hidden sm:flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#1C2840] rounded-full flex items-center justify-center transition-colors">
                  <User className="w-5 h-5 text-[#1C2840] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs text-gray-600 hidden xl:block">Hesabım</span>
              </Link>

              {/* Cart */}
              <Link
                href="/sepet"
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors relative group"
              >
                <div className="w-10 h-10 bg-[#BB1624] group-hover:bg-[#8F101B] rounded-full flex items-center justify-center transition-colors relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#1C2840] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 hidden xl:block">Sepetim</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:block bg-[#1C2840]">
          <div className="container mx-auto px-4">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  href="/urunler"
                  className="flex items-center gap-2 px-5 py-4 text-white font-medium hover:bg-[#BB1624] transition-colors"
                >
                  <Menu className="w-5 h-5" />
                  Tüm Ürünler
                </Link>
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="relative"
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <Link
                    href={`/kategori/${category.slug}`}
                    className={`flex items-center gap-1 px-4 py-4 text-white font-medium transition-colors ${activeCategory === category.id ? 'bg-[#BB1624]' : 'hover:bg-[#2A3A5A]'}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li className="ml-auto">
                <Link
                  href="/hakkimizda"
                  className="flex items-center gap-1 px-4 py-4 text-white font-medium hover:bg-[#2A3A5A] transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href="/iletisim"
                  className="flex items-center gap-1 px-4 py-4 text-white font-medium hover:bg-[#2A3A5A] transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Features Bar - Desktop only, not fixed */}
      {!isScrolled && (
        <div className="hidden lg:block bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-12 py-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-[#1C2840]/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#1C2840]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1C2840]">Ücretsiz Kargo</p>
                  <p className="text-gray-500 text-xs">{freeShippingThreshold.toLocaleString('tr-TR')} TL üzeri siparişlerde</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-[#1C2840]/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#1C2840]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1C2840]">Güvenli Ödeme</p>
                  <p className="text-gray-500 text-xs">256-bit SSL korumalı</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-[#1C2840]/10 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-[#1C2840]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1C2840]">7/24 Destek</p>
                  <p className="text-gray-500 text-xs">WhatsApp iletişim</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-[#1C2840]/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#1C2840]" />
                </div>
                <div>
                  <p className="font-semibold text-[#1C2840]">Hızlı Teslimat</p>
                  <p className="text-gray-500 text-xs">1-3 iş günü içinde</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobileMenu}
      />
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Menu Header */}
        <div className="bg-[#1C2840] text-white p-4 flex items-center justify-between">
          <Image src="/images/logo.svg" alt="Filenes Sports" width={120} height={40} className="h-8 w-auto brightness-0 invert" />
          <button onClick={closeMobileMenu} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <nav className="overflow-y-auto h-[calc(100%-64px)]">
          <ul className="py-2">
            <li>
              <Link
                href="/urunler"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-[#1C2840] font-medium hover:bg-gray-100 transition-colors border-b"
              >
                <Menu className="w-5 h-5" />
                Tüm Ürünler
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/kategori/${category.slug}`}
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 text-[#1C2840] hover:bg-gray-100 transition-colors border-b"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/hakkimizda"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-[#1C2840] hover:bg-gray-100 transition-colors border-b"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/iletisim"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-[#1C2840] hover:bg-gray-100 transition-colors border-b"
              >
                İletişim
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Footer */}
          <div className="p-4 mt-auto border-t bg-gray-50">
            <a href="tel:08503023262" className="flex items-center gap-3 text-[#1C2840] mb-3">
              <Phone className="w-5 h-5" />
              <span>0850 302 32 62</span>
            </a>
            <a href="mailto:info@fileenessports.com" className="flex items-center gap-3 text-[#1C2840]">
              <Mail className="w-5 h-5" />
              <span>info@fileenessports.com</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
    </>
  )
}
