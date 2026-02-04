import { Render } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { Metadata } from 'next'
import { Truck, MessageCircle, Shield, RefreshCcw, Phone, ArrowRight, Star, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/settings'
import { HeroSlider } from '@/components/shop/HeroSlider'
import { ProductCard } from '@/components/shop/ProductCard'

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

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_at_price: number | null
  images: string[]
  category: { name: string; slug: string } | null
}

interface Category {
  id: string
  name: string
  slug: string
  image: string | null
  description: string | null
  product_count?: number
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featured_image: string | null
  created_at: string
}

export const metadata: Metadata = {
  title: 'Filenes Sports - Profesyonel Spor ve Güvenlik Fileleri',
  description: 'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi. Futbol, basketbol, voleybol fileleri ve daha fazlası.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const settings = await getSiteSettings()

  // Fetch hero banners
  const { data: banners } = await supabaseAdmin
    .from('banners')
    .select('id, title, subtitle, image_url, mobile_image_url, link, button_text, background_color, text_color')
    .eq('position', 'hero')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Fetch featured products
  const { data: featuredProducts } = await supabaseAdmin
    .from('products')
    .select('id, name, slug, price, compare_at_price, images, category:categories(name, slug)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8)

  // Fetch new products
  const { data: newProducts } = await supabaseAdmin
    .from('products')
    .select('id, name, slug, price, compare_at_price, images, category:categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // Fetch categories with product count
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug, image, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(6)

  // Fetch blog posts
  const { data: blogPosts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, created_at')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3)

  // Check for Puck homepage
  const { data: page } = await supabase
    .from('pages')
    .select(`*, page_blocks(puck_data, is_draft)`)
    .eq('is_homepage', true)
    .eq('is_published', true)
    .single()

  const publishedBlock = page?.page_blocks?.find((block: { is_draft: boolean }) => !block.is_draft)

  if (publishedBlock?.puck_data) {
    return <Render config={puckConfig} data={publishedBlock.puck_data} />
  }

  return (
    <div>
      {/* Hero Section */}
      {banners && banners.length > 0 ? (
        <HeroSlider banners={banners} />
      ) : (
        <DefaultHero />
      )}

      {/* Features Bar */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureItem icon={<Truck />} title="Ücretsiz Kargo" desc={`${settings.free_shipping_threshold.toLocaleString('tr-TR')} TL üzeri`} />
            <FeatureItem icon={<MessageCircle />} title="WhatsApp Destek" desc="Anında iletişim" />
            <FeatureItem icon={<Shield />} title="Güvenli Ödeme" desc="SSL korumalı" />
            <FeatureItem icon={<RefreshCcw />} title="Kolay İade" desc="14 gün içinde" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[#1C2840]">Kategoriler</h2>
                <p className="text-gray-600 mt-1">İhtiyacınıza uygun ürünleri keşfedin</p>
              </div>
              <Link href="/urunler" className="hidden md:flex items-center gap-2 text-[#BB1624] hover:underline font-medium">
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat: Category) => (
                <Link key={cat.id} href={`/kategori/${cat.slug}`} className="group">
                  <div className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#1C2840] to-[#2A3A5A] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} width={48} height={48} className="object-contain" />
                      ) : (
                        <span className="text-3xl text-white">🥅</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-[#1C2840] group-hover:text-[#BB1624] transition-colors">{cat.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block bg-[#BB1624] text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">⭐ ÖNE ÇIKAN</span>
                <h2 className="text-3xl font-bold text-[#1C2840]">Popüler Ürünler</h2>
              </div>
              <Link href="/urunler" className="hidden md:flex items-center gap-2 text-[#BB1624] hover:underline font-medium">
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promo Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1C2840] via-[#2A3A5A] to-[#1C2840] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="inline-block bg-[#BB1624] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">🎯 ÖZEL SİPARİŞ</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Özel Ölçü mü İstiyorsunuz?</h2>
              <p className="text-gray-300 text-lg max-w-lg">
                Standart ölçüler size uymuyorsa, özel siparişleriniz için bizimle iletişime geçin!
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/iletisim" className="inline-flex items-center justify-center gap-2 bg-[#BB1624] hover:bg-[#8F101B] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105">
                <Phone className="w-5 h-5" />
                Bizi Arayın
              </Link>
              <Link href="/urunler" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all border border-white/30">
                Ürünleri İncele
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Products */}
      {newProducts && newProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">🆕 YENİ</span>
                <h2 className="text-3xl font-bold text-[#1C2840]">Yeni Eklenen Ürünler</h2>
              </div>
              <Link href="/urunler" className="hidden md:flex items-center gap-2 text-[#BB1624] hover:underline font-medium">
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {newProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1C2840] mb-4">Neden Filenes Sports?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Türkiye&apos;nin en güvenilir file üreticisi olarak kaliteden ödün vermiyoruz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyUsCard
              icon="🏭"
              title="Yerli Üretim"
              desc="Tüm ürünlerimiz Türkiye'de, kendi tesislerimizde üretilmektedir."
            />
            <WhyUsCard
              icon="✅"
              title="Kalite Garantisi"
              desc="UV dayanıklı, uzun ömürlü malzemeler kullanıyoruz."
            />
            <WhyUsCard
              icon="🚚"
              title="Hızlı Teslimat"
              desc="Siparişleriniz 1-3 iş günü içinde kargoya verilir."
            />
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block bg-[#1C2840] text-white text-sm font-semibold px-3 py-1 rounded-full mb-2">📝 BLOG</span>
                <h2 className="text-3xl font-bold text-[#1C2840]">Son Yazılar</h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-[#BB1624] hover:underline font-medium">
                Tümünü Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post: BlogPost) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-[#1C2840] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Kampanyalardan Haberdar Olun</h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">E-posta listemize katılın, özel indirimlerden ve yeni ürünlerden ilk siz haberdar olun!</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#BB1624]"
            />
            <button type="submit" className="bg-[#BB1624] hover:bg-[#8F101B] px-8 py-4 rounded-full font-semibold transition-colors">
              Abone Ol
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

// Helper Components
function DefaultHero() {
  return (
    <section className="relative bg-gradient-to-br from-[#1C2840] via-[#2A3A5A] to-[#1C2840] text-white py-24 overflow-hidden">
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
          <Link href="/urunler" className="inline-flex items-center justify-center gap-2 bg-[#BB1624] hover:bg-[#8F101B] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            Ürünleri İncele
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/iletisim" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all backdrop-blur-sm border border-white/20">
            <Phone className="w-5 h-5" />
            Bizi Arayın
          </Link>
        </div>
      </div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#BB1624]/20 rounded-full blur-3xl" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#BB1624]/10 rounded-full blur-3xl" />
    </section>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 p-3">
      <div className="w-12 h-12 bg-[#1C2840] rounded-xl flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-[#1C2840] text-sm">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  )
}

function WhyUsCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-bold text-[#1C2840] mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
        <div className="aspect-video bg-gray-200 relative overflow-hidden">
          {post.featured_image ? (
            <Image src={post.featured_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1C2840] to-[#2A3A5A] flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-2">{new Date(post.created_at).toLocaleDateString('tr-TR')}</p>
          <h3 className="font-bold text-[#1C2840] group-hover:text-[#BB1624] transition-colors line-clamp-2">{post.title}</h3>
          {post.excerpt && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.excerpt}</p>}
        </div>
      </div>
    </Link>
  )
}
