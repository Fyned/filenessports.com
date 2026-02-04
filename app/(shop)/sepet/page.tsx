import { getSiteSettings } from '@/lib/settings'
import { CartClient } from './CartClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sepetim - Filenes Sports',
  description: 'Alışveriş sepetinizi görüntüleyin ve siparişinizi tamamlayın.',
}

export default async function CartPage() {
  const settings = await getSiteSettings()

  return (
    <CartClient
      freeShippingThreshold={settings.free_shipping_threshold}
      defaultShippingCost={settings.default_shipping_cost}
    />
  )
}
