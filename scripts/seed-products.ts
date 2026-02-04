/**
 * Örnek Ürün Ekleme Script'i
 *
 * Çalıştırmak için:
 * npx tsx scripts/seed-products.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Örnek ürünler
const sampleProducts = [
  {
    name: 'Profesyonel Futbol Kale Filesi',
    slug: 'profesyonel-futbol-kale-filesi',
    short_description: 'FIFA standartlarına uygun, dayanıklı profesyonel futbol kale filesi. UV dayanımlı polipropilen malzeme.',
    description: `## Profesyonel Futbol Kale Filesi

Yüksek kaliteli, dayanıklı ve uzun ömürlü futbol kale filesi.

### Özellikler
- **Malzeme:** UV dayanımlı polipropilen
- **Göz Açıklığı:** 12x12 cm
- **İp Kalınlığı:** 4mm
- **Ölçüler:** 732x244 cm (standart kale ölçüsü)
- **Renk:** Beyaz

### Kullanım Alanları
- Profesyonel futbol sahaları
- Spor kompleksleri
- Okul ve üniversite sahaları
- Antrenman tesisleri

### Garanti
2 yıl üretici garantisi ile güvence altında.`,
    price: 2450.00,
    compare_price: 2990.00,
    sku: 'FK-001',
    stock: 25,
    category_slug: 'futbol-kale-filesi',
    is_active: true,
    is_featured: true,
    is_new: true,
    free_shipping: true,
  },
  {
    name: 'Voleybol Saha Filesi - Turnuva Modeli',
    slug: 'voleybol-saha-filesi-turnuva',
    short_description: 'FIVB onaylı voleybol saha filesi. Turnuva ve profesyonel maçlar için ideal.',
    description: `## Voleybol Saha Filesi - Turnuva Modeli

Uluslararası turnuvalarda kullanıma uygun profesyonel voleybol filesi.

### Özellikler
- **Malzeme:** Yüksek dayanımlı naylon
- **Göz Açıklığı:** 10x10 cm
- **İp Kalınlığı:** 3mm
- **Ölçüler:** 950x100 cm
- **Renk:** Siyah kenar bantlı beyaz

### Teknik Detaylar
- FIVB standartlarına uygun
- Çelik kablo takviyeli üst bant
- Gergi ipleri dahil
- Kolay montaj sistemi

### Paket İçeriği
- 1 adet voleybol filesi
- Gergi ipleri
- Montaj kılavuzu`,
    price: 1890.00,
    compare_price: 2290.00,
    sku: 'VB-001',
    stock: 18,
    category_slug: 'voleybol-filesi',
    is_active: true,
    is_featured: true,
    is_new: false,
    free_shipping: true,
  },
  {
    name: 'Basketbol Pota Filesi - Set',
    slug: 'basketbol-pota-filesi-set',
    short_description: 'Standart basketbol pota filesi. Dayanıklı örgü yapısı ile uzun ömürlü kullanım.',
    description: `## Basketbol Pota Filesi - Set

Profesyonel ve amatör basketbol sahaları için ideal pota filesi seti.

### Özellikler
- **Malzeme:** Dayanıklı polipropilen
- **Göz Sayısı:** 12 ilmek
- **Uzunluk:** 45 cm
- **Renk:** Beyaz/Kırmızı/Mavi seçenekleri

### Avantajlar
- Hızlı ve kolay montaj
- Yıpranmaya karşı dayanıklı
- UV ışınlarına karşı koruma
- Her hava koşulunda kullanıma uygun

### Kullanım
Standart basketbol potalarına uygundur. Montaj için özel araç gerekmez.`,
    price: 189.00,
    compare_price: 249.00,
    sku: 'BB-001',
    stock: 50,
    category_slug: 'basketbol-filesi',
    is_active: true,
    is_featured: false,
    is_new: true,
    free_shipping: false,
  },
  {
    name: 'Tenis Kortu Çevre Filesi',
    slug: 'tenis-kortu-cevre-filesi',
    short_description: 'Tenis kortları için çevre güvenlik filesi. Rüzgar kesici özellikli.',
    description: `## Tenis Kortu Çevre Filesi

Tenis kortlarını çevreleyen, rüzgar kesici özellikli profesyonel file.

### Özellikler
- **Malzeme:** HDPE (Yüksek yoğunluklu polietilen)
- **Göz Açıklığı:** 45mm x 45mm
- **Yükseklik:** 200 cm (standart)
- **Renk:** Yeşil

### Öne Çıkan Özellikler
- %85 gölgeleme oranı
- Rüzgar kesici özellik
- UV stabilize malzeme
- Paslanmaz metal ilikleri

### Ölçü Seçenekleri
- 10 metre rulo
- 25 metre rulo
- 50 metre rulo

Fiyat 10 metrelik rulo içindir.`,
    price: 890.00,
    compare_price: null,
    sku: 'TN-001',
    stock: 30,
    category_slug: 'tenis-filesi',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: true,
  },
]

// Placeholder görsel URL'leri (public klasöründeki SVG'ler)
const productImages: Record<string, string[]> = {
  'profesyonel-futbol-kale-filesi': [
    '/images/products/futbol-kale-filesi-1.svg',
  ],
  'voleybol-saha-filesi-turnuva': [
    '/images/products/voleybol-filesi-1.svg',
  ],
  'basketbol-pota-filesi-set': [
    '/images/products/basketbol-filesi-1.svg',
  ],
  'tenis-kortu-cevre-filesi': [
    '/images/products/tenis-filesi-1.svg',
  ],
}

async function seedProducts() {
  console.log('🚀 Örnek ürünler ekleniyor...\n')

  try {
    // Önce kategorileri çek
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug')

    if (catError) {
      console.error('❌ Kategoriler alınamadı:', catError.message)
      return
    }

    console.log('📁 Mevcut kategoriler:', categories?.map(c => c.slug).join(', '))

    // Her ürün için
    for (const product of sampleProducts) {
      console.log(`\n📦 Ürün ekleniyor: ${product.name}`)

      // Kategori ID'sini bul
      const category = categories?.find(c => c.slug === product.category_slug)

      // Ürün verisi hazırla
      const productData = {
        name: product.name,
        slug: product.slug,
        short_description: product.short_description,
        description: product.description,
        price: product.price,
        compare_price: product.compare_price,
        sku: product.sku,
        stock: product.stock,
        category_id: category?.id || null,
        is_active: product.is_active,
        is_featured: product.is_featured,
        is_new: product.is_new,
        free_shipping: product.free_shipping,
      }

      // Ürünü ekle
      const { data: insertedProduct, error: insertError } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'slug' })
        .select()
        .single()

      if (insertError) {
        console.error(`  ❌ Hata: ${insertError.message}`)
        continue
      }

      console.log(`  ✅ Ürün eklendi: ${insertedProduct.id}`)

      // Görselleri ekle - önce mevcut görselleri sil
      const images = productImages[product.slug] || []
      if (images.length > 0) {
        await supabase
          .from('product_images')
          .delete()
          .eq('product_id', insertedProduct.id)
      }

      for (let i = 0; i < images.length; i++) {
        const { error: imgError } = await supabase
          .from('product_images')
          .insert({
            product_id: insertedProduct.id,
            url: images[i],
            alt: `${product.name} - Görsel ${i + 1}`,
            sort_order: i,
            is_primary: i === 0,
          })

        if (imgError) {
          console.log(`  ⚠️ Görsel eklenemedi: ${imgError.message}`)
        } else {
          console.log(`  🖼️ Görsel eklendi: ${images[i]}`)
        }
      }
    }

    console.log('\n========================================')
    console.log('✅ Örnek ürünler başarıyla eklendi!')
    console.log('========================================\n')

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error)
  }
}

seedProducts()
