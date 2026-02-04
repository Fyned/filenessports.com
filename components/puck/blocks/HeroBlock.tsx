'use client'

import { ComponentConfig } from '@puckeditor/core'
import Link from 'next/link'

export type HeroBlockProps = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
  backgroundOverlay: boolean
  overlayOpacity: number
  textAlign: 'left' | 'center' | 'right'
  minHeight: string
}

export const HeroBlock: ComponentConfig<HeroBlockProps> = {
  label: 'Hero Section',
  fields: {
    title: {
      type: 'text',
      label: 'Baslik',
    },
    subtitle: {
      type: 'textarea',
      label: 'Alt Baslik',
    },
    buttonText: {
      type: 'text',
      label: 'Buton Metni',
    },
    buttonLink: {
      type: 'text',
      label: 'Buton Linki',
    },
    backgroundImage: {
      type: 'text',
      label: 'Arka Plan Gorseli URL',
    },
    backgroundOverlay: {
      type: 'radio',
      label: 'Overlay',
      options: [
        { label: 'Acik', value: true },
        { label: 'Kapali', value: false },
      ],
    },
    overlayOpacity: {
      type: 'number',
      label: 'Overlay Opakligi (0-100)',
      min: 0,
      max: 100,
    },
    textAlign: {
      type: 'radio',
      label: 'Metin Hizalama',
      options: [
        { label: 'Sol', value: 'left' },
        { label: 'Orta', value: 'center' },
        { label: 'Sag', value: 'right' },
      ],
    },
    minHeight: {
      type: 'select',
      label: 'Minimum Yukseklik',
      options: [
        { label: 'Kucuk (300px)', value: '300px' },
        { label: 'Orta (500px)', value: '500px' },
        { label: 'Buyuk (700px)', value: '700px' },
        { label: 'Tam Ekran', value: '100vh' },
      ],
    },
  },
  defaultProps: {
    title: 'Profesyonel Spor Fileleri',
    subtitle: 'Tum sahalarin vazgecilmezi',
    buttonText: 'Urunlere Git',
    buttonLink: '/urunler',
    backgroundImage: '',
    backgroundOverlay: true,
    overlayOpacity: 50,
    textAlign: 'center',
    minHeight: '500px',
  },
  render: ({
    title,
    subtitle,
    buttonText,
    buttonLink,
    backgroundImage,
    backgroundOverlay,
    overlayOpacity,
    textAlign,
    minHeight,
  }) => {
    const alignmentClasses = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end',
    }

    return (
      <section
        className="relative flex items-center justify-center"
        style={{
          minHeight,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !backgroundImage ? '#1f2937' : undefined,
        }}
      >
        {backgroundOverlay && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity / 100 }}
          />
        )}
        <div
          className={`relative z-10 container mx-auto px-4 flex flex-col ${alignmentClasses[textAlign]}`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">{subtitle}</p>
          {buttonText && (
            <Link
              href={buttonLink}
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              {buttonText}
            </Link>
          )}
        </div>
      </section>
    )
  },
}
