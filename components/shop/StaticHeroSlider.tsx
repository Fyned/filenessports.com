'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Phone, ArrowRight } from 'lucide-react'

interface HeroSlide {
  id: string
  icon: string
  title: string
  subtitle: string
  gradientFrom: string
  gradientTo: string
  buttonText: string
  buttonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

function getHeroSlides(phoneClean: string, whatsappNum: string, freeShippingThreshold: number): HeroSlide[] {
  return [
    {
      id: '1',
      icon: '⚽',
      title: 'Profesyonel Spor Fileleri',
      subtitle: 'Türkiye\'nin 1 numaralı file üreticisi. Kaliteli malzeme, uygun fiyat, hızlı teslimat!',
      gradientFrom: '#1C2840',
      gradientTo: '#2A3A5A',
      buttonText: 'Ürünleri İncele',
      buttonLink: '/urunler',
    },
    {
      id: '2',
      icon: '🏆',
      title: 'Kalite ve Güven',
      subtitle: 'UEFA ve TFF standartlarına uygun üretim. 10 yılı aşkın tecrübe ile hizmetinizdeyiz.',
      gradientFrom: '#BB1624',
      gradientTo: '#8F101B',
      buttonText: 'Hakkımızda',
      buttonLink: '/hakkimizda',
      secondaryButtonText: 'Bizi Arayın',
      secondaryButtonLink: `tel:${phoneClean}`,
    },
    {
      id: '3',
      icon: '🚚',
      title: 'Ücretsiz Kargo',
      subtitle: `${freeShippingThreshold.toLocaleString('tr-TR')} TL ve üzeri siparişlerinizde kargo tamamen ücretsiz!`,
      gradientFrom: '#166534',
      gradientTo: '#15803d',
      buttonText: 'Alışverişe Başla',
      buttonLink: '/urunler',
    },
    {
      id: '4',
      icon: '🎯',
      title: 'Özel Ölçü Üretim',
      subtitle: 'Standart ölçüler size uymuyorsa, istediğiniz ölçüde özel sipariş verebilirsiniz.',
      gradientFrom: '#7c3aed',
      gradientTo: '#8b5cf6',
      buttonText: 'Teklif Alın',
      buttonLink: '/iletisim',
      secondaryButtonText: 'WhatsApp',
      secondaryButtonLink: `https://wa.me/${whatsappNum}`,
    },
  ]
}

interface StaticHeroSliderProps {
  phone?: string
  whatsapp?: string
  freeShippingThreshold?: number
}

export function StaticHeroSlider({ phone = '+905418855676', whatsapp = '905418855676', freeShippingThreshold = 5000 }: StaticHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const whatsappNum = whatsapp.replace(/[^0-9]/g, '')
  const phoneClean = phone.replace(/\s/g, '')
  const heroSlides = getHeroSlides(phoneClean, whatsappNum, freeShippingThreshold)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length)
  }, [heroSlides.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [heroSlides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, goToNext])

  const currentSlide = heroSlides[currentIndex]

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          style={{
            background: `linear-gradient(135deg, ${slide.gradientFrom} 0%, ${slide.gradientTo} 100%)`
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large centered icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[20rem] md:text-[25rem] opacity-10 select-none">
                {slide.icon}
              </span>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            {/* Dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center relative z-10">
              {/* Icon Badge */}
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
                <span className="text-5xl md:text-6xl">{slide.icon}</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={slide.buttonLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {slide.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                {slide.secondaryButtonText && slide.secondaryButtonLink && (
                  <Link
                    href={slide.secondaryButtonLink}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
                  >
                    <Phone className="w-5 h-5" />
                    {slide.secondaryButtonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          goToPrev()
          setIsAutoPlaying(false)
          setTimeout(() => setIsAutoPlaying(true), 5000)
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
        aria-label="Önceki"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={() => {
          goToNext()
          setIsAutoPlaying(false)
          setTimeout(() => setIsAutoPlaying(true), 5000)
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all"
        aria-label="Sonraki"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
