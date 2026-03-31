'use client'

import { Truck, MessageCircle, Tag, CreditCard, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface PromoBanner {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  link: string
  linkText: string
  bgImage?: string
  overlayColor: string
}

function getPromoBanners(whatsapp: string, freeShippingThreshold: number): PromoBanner[] {
  const whatsappNum = whatsapp.replace(/[^0-9]/g, '')
  return [
  {
    icon: <Truck className="w-10 h-10" />,
    title: 'Ücretsiz Kargo',
    subtitle: `${freeShippingThreshold.toLocaleString('tr-TR')} TL Üzeri`,
    description: 'Türkiye\'nin her yerine ücretsiz teslimat',
    link: '/urunler',
    linkText: 'Alışverişe Başla',
    overlayColor: 'from-emerald-600/90 to-emerald-800/90',
  },
  {
    icon: <MessageCircle className="w-10 h-10" />,
    title: 'WhatsApp Destek',
    subtitle: '7/24 İletişim',
    description: 'Sorularınız için anında yardım alın',
    link: `https://wa.me/${whatsappNum}`,
    linkText: 'Bize Yazın',
    overlayColor: 'from-green-600/90 to-green-800/90',
  },
  {
    icon: <Tag className="w-10 h-10" />,
    title: 'Toptan Fiyat',
    subtitle: 'Özel İndirimler',
    description: 'Kurumsal müşterilere özel fiyatlar',
    link: '/iletisim',
    linkText: 'Teklif Alın',
    overlayColor: 'from-blue-600/90 to-blue-800/90',
  },
  {
    icon: <CreditCard className="w-10 h-10" />,
    title: 'Taksit İmkanı',
    subtitle: 'Peşin Fiyatına',
    description: '6 aya varan taksit seçenekleri',
    link: '/urunler',
    linkText: 'Detaylı Bilgi',
    overlayColor: 'from-purple-600/90 to-purple-800/90',
  },
]
}

interface PromoBannerGridProps {
  whatsapp?: string
  freeShippingThreshold?: number
}

export function PromoBannerGrid({ whatsapp = '+905418855676', freeShippingThreshold = 5000 }: PromoBannerGridProps) {
  const promoBanners = getPromoBanners(whatsapp, freeShippingThreshold)
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1C2840] mb-2">
            Neden Bizi Tercih Etmelisiniz?
          </h2>
          <p className="text-gray-600">
            Müşteri memnuniyeti odaklı hizmet anlayışımız
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoBanners.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              target={banner.link.startsWith('http') ? '_blank' : undefined}
              rel={banner.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500"
            >
              {/* Background Pattern */}
              <div className={`absolute inset-0 bg-gradient-to-br ${banner.overlayColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gray-100 rounded-full opacity-50 group-hover:bg-white/10 transition-colors duration-500" />

              {/* Content */}
              <div className="relative p-6 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#1C2840] group-hover:bg-white/20 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-500">
                  <div className="text-white">
                    {banner.icon}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="mb-3">
                  <p className="text-sm font-semibold text-[#BB1624] group-hover:text-white/80 transition-colors duration-500">
                    {banner.subtitle}
                  </p>
                  <h3 className="text-xl font-bold text-[#1C2840] group-hover:text-white transition-colors duration-500">
                    {banner.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-1 group-hover:text-white/80 transition-colors duration-500">
                  {banner.description}
                </p>

                {/* Link */}
                <div className="flex items-center text-[#BB1624] group-hover:text-white font-semibold text-sm transition-colors duration-500">
                  <span>{banner.linkText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
