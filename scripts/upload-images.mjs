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

// Görsel-Ürün eşleştirmeleri
const imageMap = {
  // Kale Fileleri - Minyatür (80x120, 100x140, 100x160, 120x180)
  'kale-filesi-80x120x70-cm-25mm': ['44-Filenes-Minyatr-Kale-Filesi-8012070--3mm---Standart---1-ift-.jpg'],
  'kale-filesi-80x120x70-cm-3mm': ['44-Filenes-Minyatr-Kale-Filesi-8012070--3mm---Standart---1-ift-.jpg'],
  'kale-filesi-80x120x70-cm-4mm': ['44-Filenes-Minyatr-Kale-Filesi-8012070--3mm---Standart---1-ift-.jpg'],

  'kale-filesi-100x160x70-cm-25mm': ['7-Filenes-Minyatr-Kale-Filesi-10016070---25mm---Antreman---1-i.jpg'],
  'kale-filesi-100x160x70-cm-3mm': ['43-Filenes-Minyatr-Kale-Filesi-10016070---3mm---Standart---1-if.jpg'],
  'kale-filesi-100x160x70-cm-4mm': ['4-Filenes-Minyatr-Kale-Filesi-10016070---4mm---Profesyonel-El-.jpg', '19-Filenes-Minyatr-Kale-Filesi-10016070---4mm---Profesyonel---1.jpg'],

  'kale-filesi-120x180x70-cm-25mm': ['6-Filenes-Minyatr-Kale-Filesi-12018080---25mm---Antreman---1-i.jpg'],
  'kale-filesi-120x180x70-cm-3mm': ['5-Filenes-Minyatr-Kale-Filesi-12018080---3mm---Standart---1-if.jpg'],
  'kale-filesi-120x180x70-cm-4mm': ['8-Filenes-Minyatr-Kale-Filesi-12018080---4mm---Profesyonel---1.jpg'],

  // Kale Fileleri - 3 Metre (200x300)
  'kale-filesi-200x300x100-cm-25mm': ['55-Filenes-3-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg', '20-Filenes-3-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg'],
  'kale-filesi-200x300x100-cm-3mm': ['9-Filenes-3-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg', '21-Filenes-3-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg'],
  'kale-filesi-200x300x100-cm-4mm': ['9-Filenes-3-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg'], // 4mm görsel yok, 3mm kullan

  // Kale Fileleri - 4 Metre (200x400)
  'kale-filesi-200x400x100-cm-25mm': ['27-Filenes-4-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg', '28-Filenes-4-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg'],
  'kale-filesi-200x400x100-cm-3mm': ['26-Filenes-4-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg', '25-Filenes-4-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg'],
  'kale-filesi-200x400x100-cm-4mm': ['1-Filenes-4-Metre-Kale-Filesi---4mm---Profesyonel---1-Adet-Sad.jpg', '10-Filenes-4-Metre-Kale-Filesi---4mm---Profesyonel---1-ift-Sade.jpg'],

  // Kale Fileleri - 5 Metre (200x500)
  'kale-filesi-200x500x100-cm-25mm': ['29-Filenes-5-Metre-Kale-Filesi---25mm---Antreman---1-Adet-Sadec.jpg', '30-Filenes-5-Metre-Kale-Filesi---25mm---Antreman---1-ift-Sadece.jpg'],
  'kale-filesi-200x500x100-cm-3mm': ['13-Filenes-5-Metre-Kale-Filesi---3mm---Standart---1-Adet-Sadece.jpg', '14-Filenes-5-Metre-Kale-Filesi---3mm---Standart---1-ift-Sadece-.jpg'],
  'kale-filesi-200x500x100-cm-4mm': ['2-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-Adet-Sade.jpg', '23-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-ift-Sadec.jpg'],

  // Kale Fileleri - Nizami (244x732)
  'kale-filesi-244x732x200-cm-25mm': ['3-Filenes-Nizami-Kale-Filesi---25mm---Antreman---1-ift-Sadece-.jpg', '17-Filenes-Nizami-Kale-Filesi---25mm---Antreman---1-Adet-Sadece.jpg'],
  'kale-filesi-244x732x200-cm-3mm': ['15-Filenes-Nizami-Kale-Filesi---3mm---Standart---1-Adet-Sadece-.jpg', '16-Filenes-Nizami-Kale-Filesi---3mm---Standart---1-ift-Sadece-F.jpg'],
  'kale-filesi-244x732x200-cm-4mm': ['12-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-Adet-Sade.jpg', '24-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-ift-Sadec.jpg'],

  // Kapama Fileleri
  'kapama-filesi-standart': ['31-Filenes-100cm100cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg', '32-Filenes-100cm150cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg'],
  'kapama-filesi-profesyonel': ['36-Filenes-200cm200cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg', '37-Filenes-200cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg'],
  'kapama-filesi-ozel-olcu': ['40-Filenes-150cm400cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg', '41-Filenes-150cm500cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg'],

  // Tavan Fileleri (WhatsApp görsellerinden)
  'tavan-filesi-standart': ['tavan-kapama-1.jpeg', 'tavan-kapama-2.jpeg'],
  'tavan-filesi-profesyonel': ['tavan-kapama-3.jpeg', 'tavan-kapama-4.jpeg'],
  'tavan-filesi-ozel-olcu': ['tavan-kapama-1.jpeg', 'tavan-kapama-3.jpeg'],
}

// Görsel dosyalarının bulunduğu klasörler
const imageFolders = {
  trendyol: path.join(__dirname, '..', 'gorseller', 'trendyol'),
  whatsapp: path.join(__dirname, '..', 'gorseller', 'whatsapp'),
}

async function findImageFile(filename) {
  // Trendyol klasörlerinde ara
  const trendyolSubfolders = ['kale-filesi', 'minyatur-kale-filesi', 'nizami-kale-filesi', 'hentbol-kale-filesi', 'kapama-filesi']
  for (const subfolder of trendyolSubfolders) {
    const filePath = path.join(imageFolders.trendyol, subfolder, filename)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  // WhatsApp klasörlerinde ara
  const whatsappSubfolders = ['merdiven-guvenlik-filesi', 'saha-tavan-kapama-filesi']
  for (const subfolder of whatsappSubfolders) {
    const filePath = path.join(imageFolders.whatsapp, subfolder, filename)
    if (fs.existsSync(filePath)) {
      return filePath
    }
  }

  return null
}

async function uploadImage(filePath, productSlug, index) {
  const ext = path.extname(filePath)
  const fileName = `${productSlug}-${index}${ext}`
  const storagePath = `product-images/${fileName}`

  const fileBuffer = fs.readFileSync(filePath)

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png',
      upsert: true
    })

  if (error) {
    console.error(`Upload error for ${fileName}:`, error)
    return null
  }

  // Public URL al
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return urlData.publicUrl
}

async function main() {
  console.log('Görsel yükleme başlıyor...\n')

  // Önce mevcut product_images'ı temizle
  const { error: deleteError } = await supabase
    .from('product_images')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Tümünü sil

  if (deleteError) {
    console.error('Mevcut görseller silinemedi:', deleteError)
  } else {
    console.log('Mevcut görseller temizlendi.\n')
  }

  // Ürünleri çek
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, slug')

  if (productsError) {
    console.error('Ürünler çekilemedi:', productsError)
    return
  }

  let uploadedCount = 0
  let skippedCount = 0

  for (const product of products) {
    const images = imageMap[product.slug]

    if (!images || images.length === 0) {
      console.log(`⚠️ Görsel bulunamadı: ${product.name}`)
      skippedCount++
      continue
    }

    console.log(`📦 ${product.name}`)

    for (let i = 0; i < images.length; i++) {
      const filename = images[i]
      const filePath = await findImageFile(filename)

      if (!filePath) {
        console.log(`  ❌ Dosya bulunamadı: ${filename}`)
        continue
      }

      const publicUrl = await uploadImage(filePath, product.slug, i + 1)

      if (publicUrl) {
        // product_images tablosuna ekle
        const { error: insertError } = await supabase
          .from('product_images')
          .insert({
            product_id: product.id,
            url: publicUrl,
            alt: product.name,
            is_primary: i === 0,
            sort_order: i
          })

        if (insertError) {
          console.log(`  ❌ DB kayıt hatası: ${insertError.message}`)
        } else {
          console.log(`  ✅ Yüklendi: ${filename}`)
          uploadedCount++
        }
      }
    }
  }

  console.log(`\n=============================`)
  console.log(`Toplam yüklenen: ${uploadedCount}`)
  console.log(`Atlanan ürün: ${skippedCount}`)
}

main().catch(console.error)
