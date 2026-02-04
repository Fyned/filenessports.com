'use client'

import { ComponentConfig } from '@puckeditor/core'

export type SpacerBlockProps = {
  height: string
  showDivider: boolean
}

export const SpacerBlock: ComponentConfig<SpacerBlockProps> = {
  label: 'Bosluk',
  fields: {
    height: {
      type: 'select',
      label: 'Yukseklik',
      options: [
        { label: 'Cok Kucuk (10px)', value: '10px' },
        { label: 'Kucuk (20px)', value: '20px' },
        { label: 'Orta (40px)', value: '40px' },
        { label: 'Buyuk (60px)', value: '60px' },
        { label: 'Cok Buyuk (100px)', value: '100px' },
      ],
    },
    showDivider: {
      type: 'radio',
      label: 'Ayirici Cizgi',
      options: [
        { label: 'Evet', value: true },
        { label: 'Hayir', value: false },
      ],
    },
  },
  defaultProps: {
    height: '40px',
    showDivider: false,
  },
  render: ({ height, showDivider }) => (
    <div style={{ height }} className="flex items-center container mx-auto px-4">
      {showDivider && <hr className="w-full border-gray-200" />}
    </div>
  ),
}
