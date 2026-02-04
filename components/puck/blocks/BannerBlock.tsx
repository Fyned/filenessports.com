'use client'

import { ComponentConfig } from '@puckeditor/core'
import Link from 'next/link'
import Image from 'next/image'

export type BannerBlockProps = {
  imageUrl: string
  mobileImageUrl: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  alignment: 'left' | 'center' | 'right'
  backgroundColor: string
  textColor: string
  fullWidth: boolean
}

export const BannerBlock: ComponentConfig<BannerBlockProps> = {
  label: 'Banner',
  fields: {
    imageUrl: {
      type: 'text',
      label: 'Gorsel URL',
    },
    mobileImageUrl: {
      type: 'text',
      label: 'Mobil Gorsel URL',
    },
    title: {
      type: 'text',
      label: 'Baslik',
    },
    subtitle: {
      type: 'text',
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
    alignment: {
      type: 'radio',
      label: 'Icerik Hizalama',
      options: [
        { label: 'Sol', value: 'left' },
        { label: 'Orta', value: 'center' },
        { label: 'Sag', value: 'right' },
      ],
    },
    backgroundColor: {
      type: 'text',
      label: 'Arka Plan Rengi',
    },
    textColor: {
      type: 'text',
      label: 'Metin Rengi',
    },
    fullWidth: {
      type: 'radio',
      label: 'Tam Genislik',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
  },
  defaultProps: {
    imageUrl: '',
    mobileImageUrl: '',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    alignment: 'center',
    backgroundColor: '#065f46',
    textColor: '#ffffff',
    fullWidth: true,
  },
  render: ({
    imageUrl,
    mobileImageUrl,
    title,
    subtitle,
    buttonText,
    buttonLink,
    alignment,
    backgroundColor,
    textColor,
    fullWidth,
  }) => {
    const alignmentClasses = {
      left: 'items-start text-left',
      center: 'items-center text-center',
      right: 'items-end text-right',
    }

    const hasContent = title || subtitle || buttonText

    return (
      <section className={fullWidth ? '' : 'container mx-auto px-4 py-6'}>
        <div
          className="relative rounded-lg overflow-hidden"
          style={{ backgroundColor: imageUrl ? undefined : backgroundColor }}
        >
          {imageUrl && (
            <>
              {/* Desktop image */}
              <div className="hidden md:block relative aspect-[4/1] min-h-[200px]">
                <Image src={imageUrl} alt={title || 'Banner'} fill className="object-cover" />
              </div>
              {/* Mobile image */}
              <div className="md:hidden relative aspect-[2/1] min-h-[150px]">
                <Image
                  src={mobileImageUrl || imageUrl}
                  alt={title || 'Banner'}
                  fill
                  className="object-cover"
                />
              </div>
            </>
          )}

          {hasContent && (
            <div
              className={`${imageUrl ? 'absolute inset-0' : ''} flex flex-col ${alignmentClasses[alignment]} justify-center p-8`}
              style={{ color: textColor }}
            >
              {title && <h2 className="text-2xl md:text-4xl font-bold mb-2">{title}</h2>}
              {subtitle && <p className="text-lg md:text-xl mb-4">{subtitle}</p>}
              {buttonText && buttonLink && (
                <Link
                  href={buttonLink}
                  className="inline-block px-6 py-2 bg-white text-emerald-700 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  {buttonText}
                </Link>
              )}
            </div>
          )}

          {!imageUrl && !hasContent && (
            <div className="py-16 text-center" style={{ color: textColor }}>
              <p>Banner icerigi ekleyin</p>
            </div>
          )}
        </div>
      </section>
    )
  },
}
