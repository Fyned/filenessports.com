/**
 * Tüm Kategorilere Ürün Ekleme Script'i
 *
 * Çalıştırmak için:
 * npx tsx scripts/seed-all-products.ts
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

// Tüm kategoriler için ürünler
const allProducts = [
  // BADMINTON FİLESİ
  {
    name: 'Profesyonel Badminton Filesi',
    slug: 'profesyonel-badminton-filesi',
    short_description: 'BWF standartlarına uygun, profesyonel badminton müsabakaları için tasarlanmış yüksek kaliteli file.',
    description: `## Profesyonel Badminton Filesi

BWF (Badminton World Federation) standartlarına uygun olarak üretilmiş profesyonel badminton filesi.

### Teknik Özellikler
- **Boyut:** 6.10m x 76cm (standart)
- **Malzeme:** Yüksek dayanıklı naylon
- **Göz Aralığı:** 19mm x 19mm
- **Üst Bant:** 7.5cm genişliğinde çift katlı
- **Renk:** Siyah

### Kullanım Alanları
- Profesyonel müsabakalar
- Spor salonları
- Okul ve üniversiteler
- Antrenman tesisleri

### Garanti
2 yıl üretici garantisi ile güvence altında.`,
    price: 1290.00,
    compare_price: 1590.00,
    sku: 'BD-001',
    stock: 35,
    category_slug: 'badminton-filesi',
    is_active: true,
    is_featured: true,
    is_new: true,
    free_shipping: true,
  },
  {
    name: 'Amatör Badminton Filesi',
    slug: 'amator-badminton-filesi',
    short_description: 'Hobi ve amatör kullanım için ideal badminton filesi. Ekonomik ve dayanıklı.',
    description: `## Amatör Badminton Filesi

Hobi amaçlı ve amatör oyuncular için tasarlanmış ekonomik badminton filesi.

### Teknik Özellikler
- **Boyut:** 6.10m x 76cm
- **Malzeme:** Polipropilen
- **Göz Aralığı:** 20mm x 20mm
- **Renk:** Yeşil/Siyah

### Avantajlar
- Ekonomik fiyat
- Kolay kurulum
- Hafif yapı
- Taşıma çantası dahil`,
    price: 590.00,
    compare_price: 790.00,
    sku: 'BD-002',
    stock: 50,
    category_slug: 'badminton-filesi',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: false,
  },

  // GÜVENLİK FİLESİ
  {
    name: 'İnşaat Güvenlik Filesi - Yeşil',
    slug: 'insaat-guvenlik-filesi-yesil',
    short_description: 'İnşaat ve şantiye alanları için yüksek dayanımlı güvenlik filesi. CE sertifikalı.',
    description: `## İnşaat Güvenlik Filesi - Yeşil

İnşaat projelerinde düşme riskini önlemek için tasarlanmış profesyonel güvenlik filesi.

### Teknik Özellikler
- **Malzeme:** HDPE (Yüksek yoğunluklu polietilen)
- **Göz Aralığı:** 100mm x 100mm
- **Dayanım:** 150 kN/m
- **Renk:** Yeşil
- **Sertifika:** CE EN 1263-1

### Kullanım Alanları
- İnşaat şantiyeleri
- Yüksek bina projeleri
- Köprü ve viyadük işleri
- Endüstriyel tesisler

### Güvenlik Özellikleri
- Alev geciktirici
- UV stabilize
- Kopma dayanımı yüksek`,
    price: 45.00,
    compare_price: null,
    sku: 'GF-001',
    stock: 500,
    category_slug: 'guvenlik-filesi',
    is_active: true,
    is_featured: true,
    is_new: false,
    free_shipping: false,
  },
  {
    name: 'Balkon Koruma Filesi',
    slug: 'balkon-koruma-filesi',
    short_description: 'Balkon ve teraslar için çocuk ve evcil hayvan güvenlik filesi. Şeffaf ve estetik.',
    description: `## Balkon Koruma Filesi

Balkon ve teraslarda güvenliği sağlamak için tasarlanmış şeffaf koruma filesi.

### Teknik Özellikler
- **Malzeme:** Yüksek dayanımlı naylon
- **Göz Aralığı:** 35mm x 35mm
- **Renk:** Şeffaf/Beyaz
- **Dayanım:** Çocuk ve evcil hayvan güvenliği için test edilmiş

### Avantajlar
- Görüş engeli oluşturmaz
- Kolay montaj
- Hava sirkülasyonuna izin verir
- UV dayanımlı

### Paket İçeriği
- 1 adet file (istenen ölçüde)
- Montaj klipsleri
- Kurulum kılavuzu`,
    price: 35.00,
    compare_price: 45.00,
    sku: 'GF-002',
    stock: 200,
    category_slug: 'guvenlik-filesi',
    is_active: true,
    is_featured: false,
    is_new: true,
    free_shipping: false,
  },
  {
    name: 'Havuz Güvenlik Filesi',
    slug: 'havuz-guvenlik-filesi',
    short_description: 'Havuzlar için güvenlik örtüsü. Çocukların düşmesini önler, yaprak ve kiri engeller.',
    description: `## Havuz Güvenlik Filesi

Havuzlarda güvenliği sağlamak ve temizliği korumak için çok amaçlı koruma filesi.

### Teknik Özellikler
- **Malzeme:** UV stabilize polipropilen
- **Dayanım:** 150kg/m² yük kapasitesi
- **Renk:** Mavi/Siyah
- **Ömür:** Minimum 5 yıl

### Faydaları
- Çocuk güvenliği sağlar
- Yaprak ve debris'i engeller
- Kış koruma örtüsü olarak kullanılabilir
- Kolay açılıp kapanır`,
    price: 89.00,
    compare_price: 120.00,
    sku: 'GF-003',
    stock: 80,
    category_slug: 'guvenlik-filesi',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: true,
  },

  // HALATLAR
  {
    name: 'Polipropilen Halat 10mm',
    slug: 'polipropilen-halat-10mm',
    short_description: 'Çok amaçlı polipropilen halat. Suya dayanıklı, hafif ve güçlü.',
    description: `## Polipropilen Halat 10mm

Çeşitli kullanım alanları için ideal çok amaçlı polipropilen halat.

### Teknik Özellikler
- **Çap:** 10mm
- **Kopma Yükü:** 1200 kg
- **Malzeme:** %100 Polipropilen
- **Renk:** Beyaz, Mavi, Yeşil seçenekleri

### Avantajlar
- Suya batmaz
- Çürümez
- Hafif
- UV dayanımlı

### Kullanım Alanları
- Denizcilik
- Kampçılık
- Bahçe işleri
- Spor aktiviteleri

Fiyat metre bazındadır.`,
    price: 12.00,
    compare_price: null,
    sku: 'HL-001',
    stock: 1000,
    category_slug: 'halatlar',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: false,
  },
  {
    name: 'Naylon Halat 8mm - Beyaz',
    slug: 'naylon-halat-8mm-beyaz',
    short_description: 'Yüksek dayanımlı naylon halat. Elastik yapısı ile şok emici.',
    description: `## Naylon Halat 8mm - Beyaz

Profesyonel kullanım için yüksek kaliteli naylon halat.

### Teknik Özellikler
- **Çap:** 8mm
- **Kopma Yükü:** 900 kg
- **Malzeme:** %100 Naylon (Polyamid)
- **Elastikiyet:** %15-20 uzama kapasitesi

### Özellikler
- Yüksek kopma dayanımı
- Şok emici
- Aşınmaya dayanıklı
- Düğüm atması kolay

Fiyat metre bazındadır.`,
    price: 18.00,
    compare_price: 22.00,
    sku: 'HL-002',
    stock: 800,
    category_slug: 'halatlar',
    is_active: true,
    is_featured: true,
    is_new: false,
    free_shipping: false,
  },
  {
    name: 'File Gergi Halatı Seti',
    slug: 'file-gergi-halati-seti',
    short_description: 'Spor fileleri için gergi halatı seti. Tüm aksesuarlar dahil.',
    description: `## File Gergi Halatı Seti

Spor filelerinin montajı için gerekli tüm gergi halatları ve aksesuarları.

### Set İçeriği
- 2 adet 15m gergi halatı (6mm)
- 4 adet gergi tokası
- 8 adet karabina
- 4 adet duvar kancası
- Montaj talimatları

### Uyumluluk
- Voleybol fileleri
- Badminton fileleri
- Tenis fileleri
- Diğer spor fileleri`,
    price: 189.00,
    compare_price: 249.00,
    sku: 'HL-003',
    stock: 120,
    category_slug: 'halatlar',
    is_active: true,
    is_featured: false,
    is_new: true,
    free_shipping: true,
  },

  // EKİPMAN
  {
    name: 'Voleybol File Direği Seti',
    slug: 'voleybol-file-diregi-seti',
    short_description: 'Profesyonel voleybol file direği seti. Yükseklik ayarlı, taşınabilir.',
    description: `## Voleybol File Direği Seti

Profesyonel ve amatör kullanım için tasarlanmış yüksek kaliteli voleybol direği seti.

### Teknik Özellikler
- **Malzeme:** Galvanizli çelik
- **Yükseklik:** 155cm - 243cm ayarlanabilir
- **Taban:** Ağırlıklı veya zemine montaj seçenekleri
- **Kaplama:** Toz boya

### Set İçeriği
- 2 adet direk
- File gergi sistemi
- 2 adet taban ağırlığı (kumla doldurulan)
- Montaj araçları
- Taşıma çantası

### Avantajlar
- Kolay kurulum
- Taşınabilir tasarım
- Kadın/Erkek yüksekliği ayarı
- Profesyonel görünüm`,
    price: 3490.00,
    compare_price: 4290.00,
    sku: 'EK-001',
    stock: 15,
    category_slug: 'ekipman',
    is_active: true,
    is_featured: true,
    is_new: true,
    free_shipping: true,
  },
  {
    name: 'Futbol Kale Direği Set - Mini',
    slug: 'futbol-kale-diregi-mini',
    short_description: 'Bahçe ve hobi kullanımı için mini futbol kale seti. Kolay montaj.',
    description: `## Futbol Kale Direği Set - Mini

Bahçe, park ve hobi kullanımı için ideal mini futbol kale seti.

### Teknik Özellikler
- **Ölçüler:** 180cm x 120cm x 60cm (GxYxD)
- **Malzeme:** Çelik boru (32mm)
- **Kaplama:** Toz boya (Beyaz)
- **File:** Dahil

### Avantajlar
- 5 dakikada kurulum
- Demonte taşınabilir
- Hafif yapı
- Çocuklar için güvenli tasarım`,
    price: 890.00,
    compare_price: 1190.00,
    sku: 'EK-002',
    stock: 40,
    category_slug: 'ekipman',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: false,
  },
  {
    name: 'Badminton Direk Seti - Taşınabilir',
    slug: 'badminton-direk-seti-tasinabilir',
    short_description: 'Taşınabilir badminton direk seti. Plaj, bahçe ve açık alan kullanımı için.',
    description: `## Badminton Direk Seti - Taşınabilir

Her yerde badminton oynayabilmeniz için tasarlanmış taşınabilir direk seti.

### Set İçeriği
- 2 adet teleskopik direk
- 1 adet badminton filesi
- 2 adet zemin kazığı
- Gergi ipleri
- Taşıma çantası

### Özellikler
- Teleskopik yükseklik ayarı
- 10 saniyede kurulum
- Çantada taşıma kolaylığı
- Dayanıklı alüminyum yapı`,
    price: 590.00,
    compare_price: 790.00,
    sku: 'EK-003',
    stock: 60,
    category_slug: 'ekipman',
    is_active: true,
    is_featured: false,
    is_new: true,
    free_shipping: true,
  },
  {
    name: 'File Tamir Seti',
    slug: 'file-tamir-seti',
    short_description: 'Spor fileleri için komple tamir seti. Tüm malzemeler dahil.',
    description: `## File Tamir Seti

Yırtık ve hasarlı fileleri onarmak için gerekli tüm malzemeler.

### Set İçeriği
- 5m yedek file malzemesi
- File tamir iğnesi (3 boy)
- Naylon iplik (100m)
- File tamiri kılavuzu

### Kullanım
Tüm spor fileleri için uygundur:
- Futbol kale fileleri
- Voleybol fileleri
- Badminton fileleri
- Tenis fileleri
- Güvenlik fileleri`,
    price: 149.00,
    compare_price: null,
    sku: 'EK-004',
    stock: 100,
    category_slug: 'ekipman',
    is_active: true,
    is_featured: false,
    is_new: false,
    free_shipping: false,
  },
]

async function seedAllProducts() {
  console.log('🚀 Tüm kategorilere ürünler ekleniyor...\n')

  try {
    // Önce kategorileri çek
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, slug, name')

    if (catError) {
      console.error('❌ Kategoriler alınamadı:', catError.message)
      return
    }

    console.log('📁 Mevcut kategoriler:')
    categories?.forEach(c => console.log(`   - ${c.name} (${c.slug})`))
    console.log('')

    let successCount = 0
    let errorCount = 0

    // Her ürün için
    for (const product of allProducts) {
      console.log(`\n📦 Ürün ekleniyor: ${product.name}`)

      // Kategori ID'sini bul
      const category = categories?.find(c => c.slug === product.category_slug)

      if (!category) {
        console.log(`   ⚠️ Kategori bulunamadı: ${product.category_slug}`)
      }

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

      // Ürünü ekle (varsa güncelle)
      const { data: insertedProduct, error: insertError } = await supabase
        .from('products')
        .upsert(productData, { onConflict: 'slug' })
        .select()
        .single()

      if (insertError) {
        console.error(`   ❌ Hata: ${insertError.message}`)
        errorCount++
        continue
      }

      console.log(`   ✅ Ürün eklendi: ${insertedProduct.id}`)
      console.log(`   💰 Fiyat: ${product.price} TL ${product.compare_price ? `(${product.compare_price} TL)` : ''}`)
      console.log(`   📦 Stok: ${product.stock}`)
      console.log(`   🏷️ Kategori: ${category?.name || 'Yok'}`)
      successCount++
    }

    console.log('\n========================================')
    console.log(`✅ Başarılı: ${successCount} ürün`)
    if (errorCount > 0) {
      console.log(`❌ Hatalı: ${errorCount} ürün`)
    }
    console.log('========================================\n')

  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error)
  }
}

seedAllProducts()
