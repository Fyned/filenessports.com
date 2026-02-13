import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = 'https://fpywpqrtnegzkejfizmv.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Kategori görselleri - mevcut görsellerden en uygun olanları seç
const categoryImages = [
  {
    slug: 'kale-fileleri',
    localPath: 'gorseller/trendyol/nizami-kale-filesi/12-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-Adet-Sade.jpg',
    storagePath: 'categories/kale-fileleri.jpg'
  },
  {
    slug: 'kapama-fileleri',
    localPath: 'gorseller/trendyol/kapama-filesi/31-Filenes-100cm100cm---Balkon-Filesi---Kapama-Filesi---Koruma-.jpg',
    storagePath: 'categories/kapama-fileleri.jpg'
  },
  {
    slug: 'tavan-fileleri',
    localPath: 'gorseller/whatsapp/saha-tavan-kapama-filesi/tavan-kapama-1.jpeg',
    storagePath: 'categories/tavan-fileleri.jpg'
  }
]

async function uploadCategoryImages() {
  console.log('Kategori görsellerini yükleniyor...\n')

  for (const category of categoryImages) {
    const fullPath = path.join(__dirname, '..', category.localPath)

    if (!fs.existsSync(fullPath)) {
      console.error(`Dosya bulunamadı: ${fullPath}`)
      continue
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const fileStats = fs.statSync(fullPath)
    const ext = path.extname(category.localPath).toLowerCase()
    const contentType = ext === '.jpeg' || ext === '.jpg' ? 'image/jpeg' : 'image/png'

    console.log(`Yükleniyor: ${category.slug}`)
    console.log(`  Dosya: ${category.localPath}`)
    console.log(`  Boyut: ${(fileStats.size / 1024).toFixed(2)} KB`)

    // Storage'a yükle
    const { data, error } = await supabase.storage
      .from('products')
      .upload(category.storagePath, fileBuffer, {
        contentType,
        upsert: true
      })

    if (error) {
      console.error(`  HATA: ${error.message}`)
      continue
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${category.storagePath}`
    console.log(`  Storage URL: ${publicUrl}`)

    // Veritabanındaki kategori kaydını güncelle
    const { error: updateError } = await supabase
      .from('categories')
      .update({
        image_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('slug', category.slug)

    if (updateError) {
      console.log(`  DB güncelleme hatası: ${updateError.message}`)
    } else {
      console.log(`  Veritabanı güncellendi!`)
    }
    console.log('')
  }

  console.log('Kategori görselleri yükleme tamamlandı!')
}

uploadCategoryImages().catch(console.error)
