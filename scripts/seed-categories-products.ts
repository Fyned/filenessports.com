import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Slug oluşturma fonksiyonu
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/×/g, 'x')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function seedCategoriesAndProducts() {
  console.log('🚀 Seed işlemi başlıyor...\n')

  // 1. Mevcut kategorileri pasif yap
  console.log('📦 Mevcut kategoriler pasif yapılıyor...')
  await supabase
    .from('categories')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Tüm kategoriler

  // 2. Mevcut ürünleri pasif yap
  console.log('📦 Mevcut ürünler pasif yapılıyor...')
  await supabase
    .from('products')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000') // Tüm ürünler

  // 3. Yeni kategorileri oluştur
  console.log('\n📁 Yeni kategoriler oluşturuluyor...')

  const categories = [
    {
      name: 'Kale Fileleri',
      slug: 'kale-fileleri',
      description: 'Profesyonel kale fileleri - futbol, hentbol ve diğer spor dalları için. 2.5mm, 3mm ve 4mm kalınlık seçenekleri.',
      is_active: true,
      meta_title: 'Kale Fileleri | Filenes Sports',
      meta_description: 'Profesyonel kale fileleri. Futbol, hentbol ve diğer spor dalları için yüksek kaliteli ağlar.',
    },
    {
      name: 'Kapama Fileleri',
      slug: 'kapama-fileleri',
      description: 'Saha kapama fileleri - spor tesisleri ve açık alanlar için koruma ağları.',
      is_active: true,
      meta_title: 'Kapama Fileleri | Filenes Sports',
      meta_description: 'Spor tesisleri için kapama fileleri ve koruma ağları.',
    },
    {
      name: 'Tavan Fileleri',
      slug: 'tavan-fileleri',
      description: 'Spor salonu tavan fileleri - kapalı alanlar için güvenlik ağları.',
      is_active: true,
      meta_title: 'Tavan Fileleri | Filenes Sports',
      meta_description: 'Spor salonları için tavan fileleri ve güvenlik ağları.',
    },
  ]

  const { data: createdCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select()

  if (catError) {
    console.error('❌ Kategori oluşturma hatası:', catError)
    return
  }

  console.log(`✅ ${createdCategories?.length || 0} kategori oluşturuldu`)

  // Kategori ID'lerini al
  const { data: allCategories } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', ['kale-fileleri', 'kapama-fileleri', 'tavan-fileleri'])

  const categoryMap = new Map(allCategories?.map(c => [c.slug, c.id]) || [])

  // 4. Kale Fileleri ürünlerini oluştur (21 ürün)
  console.log('\n⚽ Kale Fileleri ürünleri oluşturuluyor...')

  const kaleSizes = [
    { size: '80×120×70', desc: 'Mini kale için ideal' },
    { size: '100×160×70', desc: 'Küçük saha kalesi için' },
    { size: '120×180×70', desc: 'Standart mini kale' },
    { size: '200×300×100', desc: 'Hentbol kalesi ölçüsü' },
    { size: '200×400×100', desc: 'Futsal kalesi ölçüsü' },
    { size: '200×500×100', desc: 'Büyük saha kalesi' },
    { size: '244×732×200', desc: 'FIFA standart futbol kalesi' },
  ]

  const thicknesses = ['2.5mm', '3mm', '4mm']

  const kaleProducts = []

  for (const { size, desc } of kaleSizes) {
    for (const thickness of thicknesses) {
      const name = `Kale Filesi ${size} cm - ${thickness}`
      kaleProducts.push({
        name,
        slug: createSlug(name),
        description: `${desc}. ${thickness} kalınlığında profesyonel kale filesi. Boyut: ${size} cm. UV dayanıklı, hava koşullarına dirençli.`,
        short_description: `${size} cm boyutunda, ${thickness} kalınlığında kale filesi`,
        price: 0, // Fiyat admin panelden ayarlanacak
        compare_price: null,
        cost_price: null,
        sku: `KF-${size.replace(/×/g, '-')}-${thickness.replace('.', '')}`,
        stock: 100,
        low_stock_threshold: 10,
        category_id: categoryMap.get('kale-fileleri'),
        brand: 'Filenes Sports',
        is_active: true,
        is_featured: thickness === '3mm', // 3mm olanlar öne çıkan
        is_new: true,
        free_shipping: true,
        meta_title: `${name} | Filenes Sports`,
        meta_description: `${name} - ${desc}. Profesyonel kalitede spor ağı.`,
        tags: ['kale filesi', 'futbol', thickness, size],
      })
    }
  }

  const { data: createdKaleProducts, error: kaleError } = await supabase
    .from('products')
    .upsert(kaleProducts, { onConflict: 'slug' })
    .select()

  if (kaleError) {
    console.error('❌ Kale ürünleri hatası:', kaleError)
  } else {
    console.log(`✅ ${createdKaleProducts?.length || 0} Kale Filesi ürünü oluşturuldu`)
  }

  // 5. Kapama Fileleri ürünlerini oluştur (3 ürün)
  console.log('\n🏟️ Kapama Fileleri ürünleri oluşturuluyor...')

  const kapamaProducts = [
    {
      name: 'Kapama Filesi Standart',
      slug: 'kapama-filesi-standart',
      description: 'Standart kapama filesi. Spor sahaları ve açık alanlar için ideal koruma ağı. Metrekare bazında fiyatlandırılır.',
      short_description: 'Standart kalınlıkta kapama filesi',
      price: 0,
      sku: 'KAP-STD',
      stock: 100,
      category_id: categoryMap.get('kapama-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: true,
      is_new: true,
      free_shipping: true,
      tags: ['kapama filesi', 'koruma ağı', 'saha'],
    },
    {
      name: 'Kapama Filesi Profesyonel',
      slug: 'kapama-filesi-profesyonel',
      description: 'Profesyonel kapama filesi. Yüksek dayanıklılık, UV korumalı. Büyük spor tesisleri için önerilir.',
      short_description: 'Profesyonel kalitede kapama filesi',
      price: 0,
      sku: 'KAP-PRO',
      stock: 100,
      category_id: categoryMap.get('kapama-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: false,
      is_new: true,
      free_shipping: true,
      tags: ['kapama filesi', 'profesyonel', 'UV korumalı'],
    },
    {
      name: 'Kapama Filesi Özel Ölçü',
      slug: 'kapama-filesi-ozel-olcu',
      description: 'Özel ölçü kapama filesi. İstediğiniz boyutta üretim yapılır. Fiyat için iletişime geçin.',
      short_description: 'Özel ölçülerde kapama filesi',
      price: 0,
      sku: 'KAP-OZEL',
      stock: 100,
      category_id: categoryMap.get('kapama-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: false,
      is_new: true,
      free_shipping: true,
      tags: ['kapama filesi', 'özel ölçü', 'ısmarlama'],
    },
  ]

  const { data: createdKapamaProducts, error: kapamaError } = await supabase
    .from('products')
    .upsert(kapamaProducts, { onConflict: 'slug' })
    .select()

  if (kapamaError) {
    console.error('❌ Kapama ürünleri hatası:', kapamaError)
  } else {
    console.log(`✅ ${createdKapamaProducts?.length || 0} Kapama Filesi ürünü oluşturuldu`)
  }

  // 6. Tavan Fileleri ürünlerini oluştur (3 ürün)
  console.log('\n🏠 Tavan Fileleri ürünleri oluşturuluyor...')

  const tavanProducts = [
    {
      name: 'Tavan Filesi Standart',
      slug: 'tavan-filesi-standart',
      description: 'Standart tavan filesi. Spor salonları ve kapalı alanlar için güvenlik ağı. Metrekare bazında fiyatlandırılır.',
      short_description: 'Standart kalınlıkta tavan filesi',
      price: 0,
      sku: 'TAV-STD',
      stock: 100,
      category_id: categoryMap.get('tavan-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: true,
      is_new: true,
      free_shipping: true,
      tags: ['tavan filesi', 'güvenlik ağı', 'spor salonu'],
    },
    {
      name: 'Tavan Filesi Profesyonel',
      slug: 'tavan-filesi-profesyonel',
      description: 'Profesyonel tavan filesi. Yüksek mukavemet, uzun ömürlü. Büyük spor salonları için önerilir.',
      short_description: 'Profesyonel kalitede tavan filesi',
      price: 0,
      sku: 'TAV-PRO',
      stock: 100,
      category_id: categoryMap.get('tavan-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: false,
      is_new: true,
      free_shipping: true,
      tags: ['tavan filesi', 'profesyonel', 'yüksek mukavemet'],
    },
    {
      name: 'Tavan Filesi Özel Ölçü',
      slug: 'tavan-filesi-ozel-olcu',
      description: 'Özel ölçü tavan filesi. İstediğiniz boyutta üretim yapılır. Fiyat için iletişime geçin.',
      short_description: 'Özel ölçülerde tavan filesi',
      price: 0,
      sku: 'TAV-OZEL',
      stock: 100,
      category_id: categoryMap.get('tavan-fileleri'),
      brand: 'Filenes Sports',
      is_active: true,
      is_featured: false,
      is_new: true,
      free_shipping: true,
      tags: ['tavan filesi', 'özel ölçü', 'ısmarlama'],
    },
  ]

  const { data: createdTavanProducts, error: tavanError } = await supabase
    .from('products')
    .upsert(tavanProducts, { onConflict: 'slug' })
    .select()

  if (tavanError) {
    console.error('❌ Tavan ürünleri hatası:', tavanError)
  } else {
    console.log(`✅ ${createdTavanProducts?.length || 0} Tavan Filesi ürünü oluşturuldu`)
  }

  // Özet
  console.log('\n' + '='.repeat(50))
  console.log('📊 ÖZET')
  console.log('='.repeat(50))
  console.log(`✅ 3 kategori oluşturuldu`)
  console.log(`✅ 21 Kale Filesi ürünü`)
  console.log(`✅ 3 Kapama Filesi ürünü`)
  console.log(`✅ 3 Tavan Filesi ürünü`)
  console.log(`✅ Toplam: 27 ürün`)
  console.log('\n⚠️ NOT: Tüm fiyatlar 0 TL olarak ayarlandı.')
  console.log('⚠️ Admin panelden fiyatları güncellemeyi unutmayın!')
  console.log('='.repeat(50))
}

// Script'i çalıştır
seedCategoriesAndProducts()
  .then(() => {
    console.log('\n🎉 Seed işlemi tamamlandı!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seed hatası:', error)
    process.exit(1)
  })
