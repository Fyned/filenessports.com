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

// Banner görselleri - en etkileyici olanlar
const banners = [
  {
    file: 'trendyol/nizami-kale-filesi/12-Filenes-Nizami-Kale-Filesi---4mm---Profesyonel---1-Adet-Sade.jpg',
    title: 'Profesyonel Kale Fileleri',
    subtitle: 'FIFA standartlarında, dayanıklı ve uzun ömürlü',
    buttonText: 'Kale Filelerini İncele',
    buttonLink: '/kategori/kale-fileleri',
    storageName: 'banner-kale-filesi.jpg'
  },
  {
    file: 'whatsapp/saha-tavan-kapama-filesi/tavan-kapama-1.jpeg',
    title: 'Saha Tavan & Kapama Fileleri',
    subtitle: 'Halı saha ve spor tesisleri için profesyonel çözümler',
    buttonText: 'Tavan Filelerini İncele',
    buttonLink: '/kategori/tavan-fileleri',
    storageName: 'banner-tavan-filesi.jpeg'
  },
  {
    file: 'trendyol/kale-filesi/2-Filenes-5-Metre-Kale-Filesi---4mm---Profesyonel--1-Adet-Sade.jpg',
    title: 'Tüm Boyutlarda File Çözümleri',
    subtitle: 'Minyatürden nizamiye, her boyutta profesyonel kalite',
    buttonText: 'Tüm Ürünleri Gör',
    buttonLink: '/urunler',
    storageName: 'banner-tum-urunler.jpg'
  }
]

async function uploadBanner(filePath, storageName) {
  const fullPath = path.join(baseDir, filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Dosya bulunamadı: ${filePath}`)
    return null
  }

  const ext = path.extname(fullPath)
  const storagePath = `banners/${storageName}`
  const fileBuffer = fs.readFileSync(fullPath)

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png',
      upsert: true
    })

  if (error) {
    console.error(`❌ Upload error: ${error.message}`)
    return null
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return urlData.publicUrl
}

async function main() {
  console.log('🎨 Banner yükleme başlıyor...\n')

  // Mevcut bannerları temizle
  const { error: deleteError } = await supabase
    .from('banners')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (deleteError) {
    console.log('Mevcut bannerlar silinemedi (belki zaten yok):', deleteError.message)
  } else {
    console.log('✅ Mevcut bannerlar temizlendi.\n')
  }

  for (let i = 0; i < banners.length; i++) {
    const banner = banners[i]
    console.log(`📸 Banner ${i + 1}: ${banner.title}`)

    const imageUrl = await uploadBanner(banner.file, banner.storageName)

    if (imageUrl) {
      const { error: insertError } = await supabase
        .from('banners')
        .insert({
          title: banner.title,
          subtitle: banner.subtitle,
          image_url: imageUrl,
          button_text: banner.buttonText,
          link: banner.buttonLink,
          is_active: true,
          sort_order: i,
          position: 'hero'
        })

      if (insertError) {
        console.log(`  ❌ DB hatası: ${insertError.message}`)
      } else {
        console.log(`  ✅ Yüklendi ve kaydedildi!`)
      }
    }
  }

  console.log('\n========================================')
  console.log('🎉 Banner yükleme tamamlandı!')
  console.log('========================================')
}

main().catch(console.error)
