import { Render } from '@puckeditor/core'
import { puckConfig } from '@/lib/puck/config'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { Metadata } from 'next'
import { Truck, MessageCircle, Shield, RefreshCcw, ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getSiteSettings } from '@/lib/settings'
import { StaticHeroSlider } from '@/components/shop/StaticHeroSlider'
import { PromoBannerGrid } from '@/components/shop/PromoBannerGrid'
import { CategoryProductBlock } from '@/components/shop/CategoryProductBlock'
import { CustomOrderBanner } from '@/components/shop/FullWidthPromoBanner'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  compare_price?: number | null
  images?: string[]
  short_description?: string
  is_new?: boolean
  is_featured?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
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
  description: 'Türkiye\'nin önde gelen spor ve güvenlik filesi üreticisi. Kale fileleri, kapama fileleri, tavan fileleri ve daha fazlası.',
}

export default async function HomePage() {
  const supabase = await createClient()
  const supabaseAdmin = await getSupabaseAdmin()
  const settings = await getSiteSettings()

  // Fetch all active categories (image sütunu veritabanında yok)
  const { data: categories, error: catError } = await supabaseAdmin
    .from('categories')
    .select('id, name, slug, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Kategori ID'lerini bul
  const kaleCategory = categories?.find(c => c.slug === 'kale-fileleri')
  const kapamaCategory = categories?.find(c => c.slug === 'kapama-fileleri')
  const tavanCategory = categories?.find(c => c.slug === 'tavan-fileleri')

  // Fetch products by category - her kategori için 8 ürün çek
  const { data: kaleProducts } = kaleCategory
    ? await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, compare_price, short_description, is_new, is_featured')
        .eq('is_active', true)
        .eq('category_id', kaleCategory.id)
        .order('created_at', { ascending: false })
        .limit(8)
    : { data: [] }

  const { data: kapamaProducts } = kapamaCategory
    ? await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, compare_price, short_description, is_new, is_featured')
        .eq('is_active', true)
        .eq('category_id', kapamaCategory.id)
        .order('created_at', { ascending: false })
        .limit(8)
    : { data: [] }

  const { data: tavanProducts } = tavanCategory
    ? await supabaseAdmin
        .from('products')
        .select('id, name, slug, price, compare_price, short_description, is_new, is_featured')
        .eq('is_active', true)
        .eq('category_id', tavanCategory.id)
        .order('created_at', { ascending: false })
        .limit(8)
    : { data: [] }

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
      {/* Hero Section - Görsel bağımsız statik slider */}
      <StaticHeroSlider />

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

      {/* Category Cards Section */}
      {categories && categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-[#1C2840] text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
                KATEGORİLER
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1C2840]">Ürün Kategorilerimiz</h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                Profesyonel spor fileleri için doğru adrestesiniz
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat: Category) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ⭐ YENİ: Promosyon Banner Grid (4'lü) */}
      <PromoBannerGrid />

      {/* ⭐ KALE FİLELERİ - File Atölyesi tarzı */}
      {kaleProducts && kaleProducts.length > 0 && (
        <CategoryProductBlock
          title="KALE FİLESİ"
          description="Tüm standartlara uygun ve her alanda ihtiyaç duyulan, kalelerin vazgeçilmezi olan ürünleri inceleyin!"
          products={kaleProducts as Product[]}
          categorySlug="kale-fileleri"
          bgColor="white"
        />
      )}

      {/* ⭐ KAPAMA FİLELERİ */}
      {kapamaProducts && kapamaProducts.length > 0 && (
        <CategoryProductBlock
          title="KAPAMA FİLESİ"
          description="Spor sahaları, balkonlar ve açık alanlar için profesyonel kapama fileleri. Güvenlik ve estetik bir arada!"
          products={kapamaProducts as Product[]}
          categorySlug="kapama-fileleri"
          bgColor="gray"
        />
      )}

      {/* ⭐ TAVAN FİLELERİ */}
      {tavanProducts && tavanProducts.length > 0 && (
        <CategoryProductBlock
          title="TAVAN FİLESİ"
          description="İç mekan spor salonları için tavan koruma fileleri. Top kaçmasını önleyen profesyonel çözümler!"
          products={tavanProducts as Product[]}
          categorySlug="tavan-fileleri"
          bgColor="white"
        />
      )}

      {/* ⭐ Özel Sipariş CTA Banner */}
      <CustomOrderBanner />

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
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
        <section className="py-16 bg-white">
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

function CategoryCard({ category }: { category: Category }) {
  // Kategori için ikon belirle
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'kale-fileleri':
        return '⚽'
      case 'kapama-fileleri':
        return '🏟️'
      case 'tavan-fileleri':
        return '🏠'
      default:
        return '🥅'
    }
  }

  // Kategori için gradient belirle
  const getCategoryGradient = (slug: string) => {
    switch (slug) {
      case 'kale-fileleri':
        return 'from-green-600 to-green-800'
      case 'kapama-fileleri':
        return 'from-blue-600 to-blue-800'
      case 'tavan-fileleri':
        return 'from-purple-600 to-purple-800'
      default:
        return 'from-[#1C2840] to-[#2A3A5A]'
    }
  }

  return (
    <Link href={`/kategori/${category.slug}`} className="group">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Background Gradient with Icon */}
        <div className={`h-48 bg-gradient-to-br ${getCategoryGradient(category.slug)} relative`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-8xl opacity-30">{getCategoryIcon(category.slug)}</span>
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

          {/* Icon Badge */}
          <div className="absolute top-4 left-4 w-14 h-14 bg-white/90 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="text-3xl">{getCategoryIcon(category.slug)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#1C2840] mb-2 group-hover:text-[#BB1624] transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">
              {category.description}
            </p>
          )}
          <div className="flex items-center text-[#BB1624] font-medium">
            <span>Ürünleri Gör</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function WhyUsCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-gray-100">
      <span className="text-5xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-bold text-[#1C2840] mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  )
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100">
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
