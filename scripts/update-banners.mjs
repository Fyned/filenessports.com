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

const bannersToUpdate = [
  {
    localPath: 'gorseller/trendyol/nizami-kale-filesi/12-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-Adet-Sade.jpg',
    storagePath: 'banners/kale-fileleri-banner.jpg',
    title: 'Profesyonel Kale Fileleri'
  },
  {
    localPath: 'gorseller/trendyol/kale-filesi/2-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-Adet-Sade.jpg',
    storagePath: 'banners/tum-urunler-banner.jpg',
    title: 'Tüm Boyutlarda File Çözümleri'
  }
]

async function updateBanners() {
  console.log('Banner görsellerini güncelleniyor...\n')

  for (const banner of bannersToUpdate) {
    const fullPath = path.join(__dirname, '..', banner.localPath)

    if (!fs.existsSync(fullPath)) {
      console.error(`Dosya bulunamadı: ${fullPath}`)
      continue
    }

    const fileBuffer = fs.readFileSync(fullPath)
    const fileStats = fs.statSync(fullPath)

    console.log(`Yükleniyor: ${banner.title}`)
    console.log(`  Dosya: ${banner.localPath}`)
    console.log(`  Boyut: ${(fileStats.size / 1024).toFixed(2)} KB`)

    // Storage'a yükle (upsert: true ile mevcut dosyayı değiştirir)
    const { data, error } = await supabase.storage
      .from('products')
      .upload(banner.storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (error) {
      console.error(`  HATA: ${error.message}`)
    } else {
      const publicUrl = `${supabaseUrl}/storage/v1/object/public/products/${banner.storagePath}`
      console.log(`  Başarılı! URL: ${publicUrl}`)

      // Veritabanındaki banner kaydını da güncelle
      const { error: updateError } = await supabase
        .from('banners')
        .update({
          image_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('title', banner.title)

      if (updateError) {
        console.log(`  DB güncelleme uyarısı: ${updateError.message}`)
      } else {
        console.log(`  Veritabanı kaydı güncellendi`)
      }
    }
    console.log('')
  }

  console.log('Banner güncelleme tamamlandı!')
}

updateBanners().catch(console.error)
