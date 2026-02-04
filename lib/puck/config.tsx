import type { Config } from '@puckeditor/core'
import type { ReactNode } from 'react'
import {
  HeroBlock,
  ProductGridBlock,
  CategoryCardsBlock,
  BannerBlock,
  FeatureBannersBlock,
  TextBlock,
  SpacerBlock,
} from '@/components/puck/blocks'

export const puckConfig: Config = {
  components: {
    HeroBlock,
    ProductGridBlock,
    CategoryCardsBlock,
    BannerBlock,
    FeatureBannersBlock,
    TextBlock,
    SpacerBlock,
  },
  root: {
    fields: {
      title: {
        type: 'text',
        label: 'Sayfa Basligi',
      },
    },
    render: ({ children }: { children: ReactNode }) => (
      <main className="min-h-screen">{children}</main>
    ),
  },
}

export type PuckData = {
  root: { title?: string }
  content: Array<{
    type: string
    props: Record<string, unknown>
  }>
}
