'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Phone, FileText, ArrowRight } from 'lucide-react'

interface FullWidthPromoBannerProps {
  title: string
  subtitle: string
  description?: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText?: string
  secondaryButtonLink?: string
  backgroundImage?: string
  gradientFrom?: string
  gradientTo?: string
  textPosition?: 'left' | 'center' | 'right'
}

export function FullWidthPromoBanner({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage,
  gradientFrom = '#1C2840',
  gradientTo = '#2A3A5A',
  textPosition = 'center',
}: FullWidthPromoBannerProps) {
  const textAlignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[textPosition]

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      {backgroundImage ? (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${gradientFrom}CC 0%, ${gradientTo}CC 100%)`
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
          }}
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#BB1624]/20 rounded-full blur-2xl" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className={`flex flex-col ${textAlignClass} max-w-3xl ${textPosition === 'center' ? 'mx-auto' : textPosition === 'right' ? 'ml-auto' : ''}`}>
          {/* Subtitle Badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-6 w-fit">
            <span className="w-2 h-2 bg-[#BB1624] rounded-full animate-pulse" />
            {subtitle}
          </span>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 ${textPosition === 'center' ? 'justify-center' : textPosition === 'right' ? 'justify-end' : ''}`}>
            <Link
              href={primaryButtonLink}
              className="inline-flex items-center justify-center gap-2 bg-[#BB1624] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8F101B] transition-all hover:scale-105 shadow-lg shadow-[#BB1624]/30"
            >
              <Phone className="w-5 h-5" />
              {primaryButtonText}
            </Link>

            {secondaryButtonText && secondaryButtonLink && (
              <Link
                href={secondaryButtonLink}
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
              >
                <FileText className="w-5 h-5" />
                {secondaryButtonText}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Preset banner configurations
export function CustomOrderBanner() {
  return (
    <FullWidthPromoBanner
      subtitle="ÖZEL SİPARİŞ"
      title="İstediğiniz Ölçüde File Üretiyoruz!"
      description="Standart ölçüler size uymuyorsa, özel ölçülerinize göre profesyonel spor fileleri üretiyoruz. Hemen bizimle iletişime geçin!"
      primaryButtonText="Bizi Arayın"
      primaryButtonLink="tel:+905418855676"
      secondaryButtonText="Teklif Alın"
      secondaryButtonLink="/iletisim"
      gradientFrom="#1C2840"
      gradientTo="#2A3A5A"
    />
  )
}

export function WholesaleBanner() {
  return (
    <FullWidthPromoBanner
      subtitle="TOPTAN SATIŞ"
      title="Spor Kulüpleri ve Belediyeler İçin Özel Fiyatlar"
      description="Toplu alımlarda özel indirimler ve ödeme kolaylıkları sunuyoruz. Kurumsal müşterilerimize özel fiyat teklifi için bize ulaşın."
      primaryButtonText="Teklif İsteyin"
      primaryButtonLink="/iletisim"
      gradientFrom="#BB1624"
      gradientTo="#8F101B"
      textPosition="left"
    />
  )
}
