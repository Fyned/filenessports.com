import { Render } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Metadata } from 'next'
import { Truck, MessageCircle, Shield, RefreshCcw, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getSiteSettings } from '@/lib/settings'
import { HeroSlider } from '@/components/shop/HeroSlider'

interface Banner {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string
  mobile_image_url: string | null
  link: string | null
  button_text: string | null
  background_color: string | null
  text_color: string | null
}

interface DefaultHomepageProps {
  freeShippingThreshold: number
  banners: Banner[]
}

// Default hero section (shown when no banners exist)
function DefaultHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1C2840] via-[#2A3A5A] to-[#1C2840] text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block bg-[#BB1624] text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
          🏆 Türkiye&apos;nin 1 Numaralı File Üreticisi
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Profesyonel<br />
          <span className="text-[#BB1624]">Spor Fileleri</span>
        </h1>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Türkiye&apos;nin önde gelen spor ve güvenlik filesi üreticisi.
          Kaliteli ürünlerimizle sahalarınızı güvende tutun.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center gap-2 bg-[#BB1624] hover:bg-[#8F101B] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg"
          >
            Ürünleri İncele
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm border border-white/20"
          >
            <Phone className="w-5 h-5" />
            Bizi Arayın
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#BB1624]/20 rounded-full blur-3xl" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#BB1624]/10 rounded-full blur-3xl" />
    </section>
  )
}

// Default homepage component
function DefaultHomepage({ freeShippingThreshold, banners }: DefaultHomepageProps) {
  return (
    <div>
      {/* Hero Section - Show slider if banners exist, otherwise show default */}
      {banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <DefaultHero />
      )}

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-[#1C2840] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#1C2840]">Ücretsiz Kargo</h3>
              <p className="text-sm text-gray-600 mt-1">{freeShippingThreshold.toLocaleString('tr-TR')} TL üzeri siparişlerde</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-[#1C2840] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#1C2840]">WhatsApp Destek</h3>
              <p className="text-sm text-gray-600 mt-1">Anında iletişim</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-[#1C2840] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#1C2840]">Güvenli Ödeme</h3>
              <p className="text-sm text-gray-600 mt-1">SSL korumalı</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-[#1C2840] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <RefreshCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-[#1C2840]">Kolay İade</h3>
              <p className="text-sm text-gray-600 mt-1">14 gün iade hakkı</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1C2840] text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="inline-block bg-[#BB1624] text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
            ÖZEL SİPARİŞ
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Özel Sipariş mi İstiyorsunuz?
          </h2>
          <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg">
            Farklı ölçülerde veya özel tasarımlı file ihtiyacınız mı var?
            Bize ulaşın, size özel çözüm üretelim.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center gap-2 bg-[#BB1624] hover:bg-[#8F101B] text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-xl"
          >
            Bizimle İletişime Geçin
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Filenes Sports - Profesyonel Spor ve Güvenlik Fileleri',
  description: 'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi. Futbol, basketbol, voleybol fileleri ve daha fazlası.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const settings = await getSiteSettings()

  // Fetch hero banners (using admin client to bypass RLS)
  const { data: banners, error: bannersError } = await supabaseAdmin
    .from('banners')
    .select('id, title, subtitle, image_url, mobile_image_url, link, button_text, background_color, text_color')
    .eq('position', 'hero')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (bannersError) {
    console.error('Error fetching banners:', bannersError)
  }

  // Fetch homepage data from Supabase
  const { data: page } = await supabase
    .from('pages')
    .select(`
      *,
      page_blocks(puck_data, is_draft)
    `)
    .eq('is_homepage', true)
    .eq('is_published', true)
    .single()

  // Find published (non-draft) page block
  const publishedBlock = page?.page_blocks?.find((block: { is_draft: boolean }) => !block.is_draft)

  if (publishedBlock?.puck_data) {
    return <Render config={puckConfig} data={publishedBlock.puck_data} />
  }

  // Return default homepage if no Puck data
  return <DefaultHomepage freeShippingThreshold={settings.free_shipping_threshold} banners={banners || []} />
}
