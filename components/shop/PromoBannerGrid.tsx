'use client'

import { Truck, MessageCircle, Tag, CreditCard } from 'lucide-react'
import Link from 'next/link'

interface PromoBanner {
  icon: React.ReactNode
  title: string
  subtitle: string
  link: string
  bgColor: string
  hoverColor: string
}

const promoBanners: PromoBanner[] = [
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Ücretsiz Kargo',
    subtitle: '500 TL üzeri siparişlerde',
    link: '/urunler',
    bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'WhatsApp Destek',
    subtitle: '7/24 hızlı iletişim',
    link: 'https://wa.me/908503023262',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
  },
  {
    icon: <Tag className="w-8 h-8" />,
    title: 'Özel Fiyatlar',
    subtitle: 'Toptan alımlarda indirim',
    link: '/iletisim',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: 'Taksit İmkanı',
    subtitle: 'Peşin fiyatına 3 taksit',
    link: '/urunler',
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
  },
]

export function PromoBannerGrid() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {promoBanners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              target={banner.link.startsWith('http') ? '_blank' : undefined}
              rel={banner.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`${banner.bgColor} ${banner.hoverColor} rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  {banner.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{banner.title}</h3>
                  <p className="text-white/80 text-sm">{banner.subtitle}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
