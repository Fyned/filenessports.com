'use client'

import { ComponentConfig } from '@puckeditor/core'

export type TextBlockProps = {
  content: string
  alignment: 'left' | 'center' | 'right' | 'justify'
  maxWidth: 'sm' | 'md' | 'lg' | 'full'
}

export const TextBlock: ComponentConfig<TextBlockProps> = {
  label: 'Metin Blogu',
  fields: {
    content: {
      type: 'textarea',
      label: 'Icerik',
    },
    alignment: {
      type: 'select',
      label: 'Hizalama',
      options: [
        { label: 'Sol', value: 'left' },
        { label: 'Orta', value: 'center' },
        { label: 'Sag', value: 'right' },
        { label: 'Iki Yana', value: 'justify' },
      ],
    },
    maxWidth: {
      type: 'select',
      label: 'Maksimum Genislik',
      options: [
        { label: 'Dar', value: 'sm' },
        { label: 'Orta', value: 'md' },
        { label: 'Genis', value: 'lg' },
        { label: 'Tam', value: 'full' },
      ],
    },
  },
  defaultProps: {
    content: '',
    alignment: 'left',
    maxWidth: 'lg',
  },
  render: ({ content, alignment, maxWidth }) => {
    const widthClasses = {
      sm: 'max-w-xl',
      md: 'max-w-3xl',
      lg: 'max-w-5xl',
      full: 'max-w-full',
    }

    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    }

    return (
      <section className="py-8">
        <div className={`container mx-auto px-4 ${widthClasses[maxWidth]}`}>
          <div
            className={`prose prose-lg ${alignmentClasses[alignment]} prose-emerald`}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>
    )
  },
}
