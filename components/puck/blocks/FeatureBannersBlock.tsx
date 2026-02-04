'use client'

import { ComponentConfig } from '@puckeditor/core'
import { Truck, MessageCircle, Percent, CreditCard, Shield, Clock, Package, Star } from 'lucide-react'

export type FeatureBannersBlockProps = {
  features: Array<{
    icon: string
    title: string
    description: string
    link: string
  }>
  backgroundColor: string
}

const iconMap: Record<string, React.ElementType> = {
  truck: Truck,
  'message-circle': MessageCircle,
  percent: Percent,
  'credit-card': CreditCard,
  shield: Shield,
  clock: Clock,
  package: Package,
  star: Star,
}

export const FeatureBannersBlock: ComponentConfig<FeatureBannersBlockProps> = {
  label: 'Ozellik Bannerlari',
  fields: {
    features: {
      type: 'array',
      label: 'Ozellikler',
      arrayFields: {
        icon: {
          type: 'select',
          label: 'Ikon',
          options: [
            { label: 'Kargo', value: 'truck' },
            { label: 'Mesaj', value: 'message-circle' },
            { label: 'Indirim', value: 'percent' },
            { label: 'Kredi Karti', value: 'credit-card' },
            { label: 'Guvenlik', value: 'shield' },
            { label: 'Saat', value: 'clock' },
            { label: 'Paket', value: 'package' },
            { label: 'Yildiz', value: 'star' },
          ],
        },
        title: {
          type: 'text',
          label: 'Baslik',
        },
        description: {
          type: 'text',
          label: 'Aciklama',
        },
        link: {
          type: 'text',
          label: 'Link',
        },
      },
    },
    backgroundColor: {
      type: 'text',
      label: 'Arka Plan Rengi',
    },
  },
  defaultProps: {
    features: [
      { icon: 'truck', title: 'Ucretsiz Kargo', description: '500TL uzeri siparislerde', link: '' },
      {
        icon: 'message-circle',
        title: 'WhatsApp Iletisim',
        description: 'Bize hemen ulasin',
        link: '',
      },
      { icon: 'percent', title: '3 Al 2 Ode', description: 'Basketbol filelerinde', link: '' },
      {
        icon: 'credit-card',
        title: 'Taksit Imkani',
        description: 'Pesin fiyatina 3 taksit',
        link: '',
      },
    ],
    backgroundColor: '#f9fafb',
  },
  render: ({ features, backgroundColor }) => (
    <section className="py-8" style={{ backgroundColor }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const IconComponent = iconMap[feature.icon] || Package
            const content = (
              <div
                className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition"
                key={i}
              >
                <IconComponent className="w-10 h-10 mx-auto text-emerald-600 mb-3" />
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            )

            if (feature.link) {
              return (
                <a href={feature.link} key={i}>
                  {content}
                </a>
              )
            }

            return content
          })}
        </div>
      </div>
    </section>
  ),
}
