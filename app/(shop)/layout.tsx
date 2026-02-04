import { Header } from '@/components/shop/Header'
import { Footer } from '@/components/shop/Footer'
import { WhatsAppButton } from '@/components/shop/WhatsAppButton'
import { getSiteSettings } from '@/lib/settings'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <>
      <Header freeShippingThreshold={settings.free_shipping_threshold} />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
