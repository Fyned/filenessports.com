import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabase = createClient(
  'https://fpywpqrtnegzkejfizmv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZweXdwcXJ0bmVnemtlamZpem12Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTc2NzM5NSwiZXhwIjoyMDg1MzQzMzk1fQ.jc9YYIlr2fqG018pUucGP39ZzGCzp49JtS9cCjL5oE4'
)

const BUCKET_NAME = 'products'
const baseDir = path.join(__dirname, '..', 'gorseller')

// Tüm görselleri kategorilere göre grupla
const imageGroups = {
  // Minyatür kale fileleri (küçük boyutlar: 80x120, 100x140, 100x160, 120x180)
  minyatur: [
    'trendyol/minyatur-kale-filesi/4-Filenes-Minyatr-Kale-Filesi-10016070---4mm---Profesyonel-El-.jpg',
    'trendyol/minyatur-kale-filesi/5-Filenes-Minyatr-Kale-Filesi-12018080---3mm---Standart---1-if.jpg',
    'trendyol/minyatur-kale-filesi/6-Filenes-Minyatr-Kale-Filesi-12018080---25mm---Antreman---1-i.jpg',
    'trendyol/minyatur-kale-filesi/7-Filenes-Minyatr-Kale-Filesi-10016070---25mm---Antreman---1-i.jpg',
    'trendyol/minyatur-kale-filesi/8-Filenes-Minyatr-Kale-Filesi-12018080---4mm---Profesyonel---1.jpg',
    'trendyol/minyatur-kale-filesi/18-Filenes-Minyatr-Kale-Filesi-10014070---3mm---Standart---1-if.jpg',
    'trendyol/minyatur-kale-filesi/19-Filenes-Minyatr-Kale-Filesi-10016070---4mm---Profesyonel---1.jpg',
    'trendyol/minyatur-kale-filesi/43-Filenes-Minyatr-Kale-Filesi-10016070---3mm---Standart---1-if.jpg',
    'trendyol/minyatur-kale-filesi/44-Filenes-Minyatr-Kale-Filesi-8012070--3mm---Standart---1-ift-.jpg',
  ],

  // 3 Metre kale fileleri (200x300)
  kale3m: [
    'trendyol/kale-filesi/9-Filenes-3-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg',
    'trendyol/kale-filesi/20-Filenes-3-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg',
    'trendyol/kale-filesi/21-Filenes-3-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg',
    'trendyol/kale-filesi/55-Filenes-3-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg',
  ],

  // 4 Metre kale fileleri (200x400)
  kale4m: [
    'trendyol/kale-filesi/1-Filenes-4-Metre-Kale-Filesi---4mm---Profesyonel---1-Adet-Sad.jpg',
    'trendyol/kale-filesi/10-Filenes-4-Metre-Kale-Filesi---4mm---Profesyonel---1-ift-Sade.jpg',
    'trendyol/kale-filesi/25-Filenes-4-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg',
    'trendyol/kale-filesi/26-Filenes-4-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg',
    'trendyol/kale-filesi/27-Filenes-4-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg',
    'trendyol/kale-filesi/28-Filenes-4-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg',
  ],

  // 5 Metre kale fileleri (200x500)
  kale5m: [
    'trendyol/kale-filesi/2-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-Adet-Sade.jpg',
    'trendyol/kale-filesi/13-Filenes-5-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg',
    'trendyol/kale-filesi/14-Filenes-5-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg',
    'trendyol/kale-filesi/23-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-ift-Sadec.jpg',
    'trendyol/kale-filesi/29-Filenes-5-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg',
    'trendyol/kale-filesi/30-Filenes-5-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg',
  ],

  // Nizami kale fileleri (244x732)
  nizami: [
    'trendyol/nizami-kale-filesi/3-Filenes-Nizami-Kale-Filesi---25mm---Antreman---1-ift-Sadece-.jpg',
    'trendyol/nizami-kale-filesi/12-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-Adet-Sade.jpg',
    'trendyol/nizami-kale-filesi/15-Filenes-Nizami-Kale-Filesi---3mm---Standart---1-Adet-Sadece-.jpg',
    'trendyol/nizami-kale-filesi/16-Filenes-Nizami-Kale-Filesi---3mm---Standart---1-ift-Sadece-F.jpg',
    'trendyol/nizami-kale-filesi/17-Filenes-Nizami-Kale-Filesi---25mm---Antreman---1-Adet-Sadece.jpg',
    'trendyol/nizami-kale-filesi/24-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-ift-Sadec.jpg',
  ],

  // Hentbol kale fileleri
  hentbol: [
    'trendyol/hentbol-kale-filesi/11-Filenes-Hentbol-Kale-Filesi---4mm---Profesyonel---1-ift-Sade.jpg',
    'trendyol/hentbol-kale-filesi/22-Filenes-Hentbol-Kale-Filesi---Profesyonel---4mm---1-Adet-Sad.jpg',
  ],

  // Kapama fileleri - Beyaz
  kapamaBeyaz: [
    'trendyol/kapama-filesi/31-Filenes-100cm100cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/32-Filenes-100cm150cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/33-Filenes-100cm100cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/34-Filenes-100cm150cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/35-Filenes-100cm200cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/45-Filenes-100cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/50-Filenes-100cm200cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/52-Filenes-100cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
  ],

  // Kapama fileleri - Büyük
  kapamaBuyuk: [
    'trendyol/kapama-filesi/36-Filenes-200cm200cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/37-Filenes-200cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/38-Filenes-200cm400cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/39-Filenes-200cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/46-Filenes-200cm400cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/47-Filenes-200cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/48-Filenes-200cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/51-Filenes-200cm200cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
  ],

  // Kapama fileleri - Orta
  kapamaOrta: [
    'trendyol/kapama-filesi/40-Filenes-150cm400cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/41-Filenes-150cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/42-Filenes-150cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/49-Filenes-150cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/53-Filenes-150cm300cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    'trendyol/kapama-filesi/54-Filenes-150cm400cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
  ],

  // Tavan/Saha kapama fileleri (WhatsApp)
  tavan: [
    'whatsapp/saha-tavan-kapama-filesi/tavan-kapama-1.jpeg',
    'whatsapp/saha-tavan-kapama-filesi/tavan-kapama-2.jpeg',
    'whatsapp/saha-tavan-kapama-filesi/tavan-kapama-3.jpeg',
    'whatsapp/saha-tavan-kapama-filesi/tavan-kapama-4.jpeg',
  ],

  // Güvenlik fileleri (WhatsApp)
  guvenlik: [
    'whatsapp/merdiven-guvenlik-filesi/guvenlik-filesi-1.jpeg',
    'whatsapp/merdiven-guvenlik-filesi/guvenlik-filesi-2.jpeg',
    'whatsapp/merdiven-guvenlik-filesi/guvenlik-filesi-3.jpeg',
    'whatsapp/merdiven-guvenlik-filesi/guvenlik-filesi-4.jpeg',
    'whatsapp/merdiven-guvenlik-filesi/guvenlik-filesi-5.jpeg',
  ],
}

// Ürün-görsel eşleştirmeleri (her ürüne 3-5 farklı görsel)
const productImageMap = {
  // Minyatür Kale Fileleri (80x120)
  'kale-filesi-80x120x70-cm-25mm': [...imageGroups.minyatur.slice(0, 4)],
  'kale-filesi-80x120x70-cm-3mm': [...imageGroups.minyatur.slice(1, 5)],
  'kale-filesi-80x120x70-cm-4mm': [...imageGroups.minyatur.slice(2, 6)],

  // Minyatür Kale Fileleri (100x160)
  'kale-filesi-100x160x70-cm-25mm': [imageGroups.minyatur[3], imageGroups.minyatur[0], imageGroups.minyatur[5], imageGroups.minyatur[8]],
  'kale-filesi-100x160x70-cm-3mm': [imageGroups.minyatur[7], imageGroups.minyatur[4], imageGroups.minyatur[1], imageGroups.minyatur[6]],
  'kale-filesi-100x160x70-cm-4mm': [imageGroups.minyatur[0], imageGroups.minyatur[6], imageGroups.minyatur[2], imageGroups.minyatur[8]],

  // Minyatür Kale Fileleri (120x180)
  'kale-filesi-120x180x70-cm-25mm': [imageGroups.minyatur[2], imageGroups.minyatur[5], imageGroups.minyatur[7], imageGroups.minyatur[0]],
  'kale-filesi-120x180x70-cm-3mm': [imageGroups.minyatur[1], imageGroups.minyatur[4], imageGroups.minyatur[8], imageGroups.minyatur[3]],
  'kale-filesi-120x180x70-cm-4mm': [imageGroups.minyatur[4], imageGroups.minyatur[0], imageGroups.minyatur[6], imageGroups.minyatur[2]],

  // 3 Metre Kale Fileleri (200x300)
  'kale-filesi-200x300x100-cm-25mm': [...imageGroups.kale3m, imageGroups.nizami[0]],
  'kale-filesi-200x300x100-cm-3mm': [imageGroups.kale3m[0], imageGroups.kale3m[2], imageGroups.kale4m[2], imageGroups.nizami[2]],
  'kale-filesi-200x300x100-cm-4mm': [imageGroups.kale4m[0], imageGroups.kale3m[1], imageGroups.kale5m[0], imageGroups.nizami[1]],

  // 4 Metre Kale Fileleri (200x400)
  'kale-filesi-200x400x100-cm-25mm': [imageGroups.kale4m[4], imageGroups.kale4m[5], imageGroups.kale3m[1], imageGroups.nizami[4]],
  'kale-filesi-200x400x100-cm-3mm': [imageGroups.kale4m[2], imageGroups.kale4m[3], imageGroups.kale5m[1], imageGroups.nizami[2]],
  'kale-filesi-200x400x100-cm-4mm': [imageGroups.kale4m[0], imageGroups.kale4m[1], imageGroups.kale5m[0], imageGroups.nizami[1]],

  // 5 Metre Kale Fileleri (200x500)
  'kale-filesi-200x500x100-cm-25mm': [imageGroups.kale5m[4], imageGroups.kale5m[5], imageGroups.kale4m[4], imageGroups.nizami[0]],
  'kale-filesi-200x500x100-cm-3mm': [imageGroups.kale5m[1], imageGroups.kale5m[2], imageGroups.kale4m[2], imageGroups.nizami[2]],
  'kale-filesi-200x500x100-cm-4mm': [imageGroups.kale5m[0], imageGroups.kale5m[3], imageGroups.kale4m[0], imageGroups.nizami[1]],

  // Nizami Kale Fileleri (244x732)
  'kale-filesi-244x732x200-cm-25mm': [imageGroups.nizami[0], imageGroups.nizami[4], imageGroups.kale5m[4], imageGroups.hentbol[0]],
  'kale-filesi-244x732x200-cm-3mm': [imageGroups.nizami[2], imageGroups.nizami[3], imageGroups.kale5m[1], imageGroups.hentbol[1]],
  'kale-filesi-244x732x200-cm-4mm': [imageGroups.nizami[1], imageGroups.nizami[5], imageGroups.kale5m[0], imageGroups.hentbol[0]],

  // Kapama Fileleri
  'kapama-filesi-standart': [...imageGroups.kapamaBeyaz.slice(0, 4), imageGroups.guvenlik[0]],
  'kapama-filesi-profesyonel': [...imageGroups.kapamaBuyuk.slice(0, 4), imageGroups.guvenlik[1]],
  'kapama-filesi-ozel-olcu': [...imageGroups.kapamaOrta.slice(0, 4), imageGroups.guvenlik[2]],

  // Tavan Fileleri
  'tavan-filesi-standart': [...imageGroups.tavan, imageGroups.guvenlik[3]],
  'tavan-filesi-profesyonel': [imageGroups.tavan[2], imageGroups.tavan[0], imageGroups.tavan[3], imageGroups.guvenlik[4], imageGroups.guvenlik[0]],
  'tavan-filesi-ozel-olcu': [imageGroups.tavan[1], imageGroups.tavan[3], imageGroups.guvenlik[1], imageGroups.guvenlik[2], imageGroups.kapamaOrta[0]],
}

async function uploadImage(filePath, productSlug, index) {
  const fullPath = path.join(baseDir, filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ Dosya bulunamadı: ${filePath}`)
    return null
  }

  const ext = path.extname(fullPath)
  const fileName = `${productSlug}-${index}${ext}`
  const storagePath = `product-images/${fileName}`

  const fileBuffer = fs.readFileSync(fullPath)

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png',
      upsert: true
    })

  if (error) {
    console.error(`  ❌ Upload error: ${error.message}`)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return urlData.publicUrl
}

async function main() {
  console.log('🚀 Kapsamlı görsel yükleme başlıyor...\n')

  // Mevcut product_images'ı temizle
  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteError) {
    console.error('Mevcut görseller silinemedi:', deleteError)
  } else {
    console.log('✅ Mevcut görseller temizlendi.\n')
  }

  // Ürünleri çek
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, slug')

  if (productsError) {
    console.error('Ürünler çekilemedi:', productsError)
    return
  }

  let totalUploaded = 0
  let totalProducts = 0

  for (const product of products) {
    const images = productImageMap[product.slug]

    if (!images || images.length === 0) {
      console.log(`⚠️ Eşleştirme yok: ${product.name}`)
      continue
    }

    console.log(`\n📦 ${product.name} (${images.length} görsel)`)
    totalProducts++

    for (let i = 0; i < images.length; i++) {
      const imagePath = images[i]
      const publicUrl = await uploadImage(imagePath, product.slug, i + 1)

      if (publicUrl) {
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            url: publicUrl,
            alt: `${product.name} - Görsel ${i + 1}`,
            is_primary: i === 0,
            sort_order: i
          })

        if (insertError) {
          console.log(`  ❌ DB hatası: ${insertError.message}`)
        } else {
          console.log(`  ✅ ${i + 1}. görsel yüklendi`)
          totalUploaded++
        }
      }
    }
  }

  console.log(`\n========================================`)
  console.log(`📊 SONUÇ:`)
  console.log(`   Toplam ürün: ${totalProducts}`)
  console.log(`   Toplam görsel: ${totalUploaded}`)
  console.log(`   Ortalama görsel/ürün: ${(totalUploaded / totalProducts).toFixed(1)}`)
  console.log(`========================================`)
}

main().catch(console.error)
