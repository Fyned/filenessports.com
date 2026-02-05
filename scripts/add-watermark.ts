/**
 * Filenes Sports - Otomatik Watermark Ekleme Scripti
 *
 * Kullanım:
 *   npx tsx scripts/add-watermark.ts
 *
 * Bu script:
 * 1. public/images/products-raw/ klasöründeki tüm görselleri alır
 * 2. Her görsele sağ alt köşeye logo ekler
 * 3. Sonucu public/images/products/ klasörüne kaydeder
 * 4. Kategori ve banner görselleri için de aynısını yapar
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// Klasör yapısı
const FOLDERS = {
  // Raw görseller (watermark'sız)
  rawProducts: 'public/images/products-raw',
  rawCategories: 'public/images/categories-raw',
  rawBanners: 'public/images/banners-raw',
  rawAds: 'public/images/ads-raw',

  // İşlenmiş görseller (watermark'lı)
  products: 'public/images/products',
  categories: 'public/images/categories',
  banners: 'public/images/banners',
  ads: 'public/images/ads',
}

// Logo ayarları
const LOGO_PATH = 'public/images/logo.svg'
const LOGO_PNG_PATH = 'public/images/logo-watermark.png'

// Watermark boyutları (görsel tipine göre)
const WATERMARK_SIZES = {
  products: { width: 150, height: 60, margin: 20, opacity: 0.7 },
  categories: { width: 120, height: 48, margin: 15, opacity: 0.6 },
  banners: { width: 180, height: 72, margin: 30, opacity: 0.5 },
  ads: { width: 100, height: 40, margin: 10, opacity: 0.8 },
}

// Desteklenen görsel formatları
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp']

async function ensureDirectories() {
  console.log('📁 Klasörler kontrol ediliyor...')

  for (const folder of Object.values(FOLDERS)) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
      console.log(`  ✅ Oluşturuldu: ${folder}`)
    }
  }
}

async function prepareLogo() {
  console.log('\n🎨 Logo hazırlanıyor...')

  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`  ❌ Logo bulunamadı: ${LOGO_PATH}`)
    process.exit(1)
  }

  // SVG'yi PNG'ye çevir (maksimum kalite)
  await sharp(LOGO_PATH)
    .resize(300, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(LOGO_PNG_PATH)

  console.log(`  ✅ Logo PNG oluşturuldu: ${LOGO_PNG_PATH}`)
}

async function addWatermark(
  inputPath: string,
  outputPath: string,
  type: 'products' | 'categories' | 'banners' | 'ads'
) {
  const settings = WATERMARK_SIZES[type]

  // Orijinal görsel boyutlarını al
  const metadata = await sharp(inputPath).metadata()
  const imageWidth = metadata.width || 1200
  const imageHeight = metadata.height || 1200

  // Logo boyutunu görsel boyutuna göre ayarla
  const logoWidth = Math.min(settings.width, Math.floor(imageWidth * 0.15))
  const logoHeight = Math.floor(logoWidth * 0.4)

  // Logo'yu hazırla (boyutlandır ve opacity uygula)
  const logo = await sharp(LOGO_PNG_PATH)
    .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .modulate({ brightness: 1 })
    .toBuffer()

  // Opacity için composite ile alpha kanalı ayarla
  const logoWithOpacity = await sharp(logo)
    .composite([{
      input: Buffer.from([255, 255, 255, Math.floor(255 * settings.opacity)]),
      raw: { width: 1, height: 1, channels: 4 },
      tile: true,
      blend: 'dest-in'
    }])
    .toBuffer()

  // Watermark pozisyonu (sağ alt köşe)
  const left = imageWidth - logoWidth - settings.margin
  const top = imageHeight - logoHeight - settings.margin

  // Görseli işle ve kaydet
  await sharp(inputPath)
    .composite([{
      input: logoWithOpacity,
      left: Math.max(0, left),
      top: Math.max(0, top),
    }])
    .jpeg({ quality: 90 })
    .toFile(outputPath)
}

async function processFolder(
  rawFolder: string,
  outputFolder: string,
  type: 'products' | 'categories' | 'banners' | 'ads'
) {
  if (!fs.existsSync(rawFolder)) {
    console.log(`  ⚠️ Klasör bulunamadı: ${rawFolder}`)
    return 0
  }

  const files = fs.readdirSync(rawFolder)
  const images = files.filter(f => SUPPORTED_FORMATS.includes(path.extname(f).toLowerCase()))

  if (images.length === 0) {
    console.log(`  ⚠️ Görsel bulunamadı: ${rawFolder}`)
    return 0
  }

  let processed = 0

  for (const image of images) {
    const inputPath = path.join(rawFolder, image)
    const outputName = image.replace(/\.[^.]+$/, '.jpg') // Her şeyi JPG yap
    const outputPath = path.join(outputFolder, outputName)

    try {
      await addWatermark(inputPath, outputPath, type)
      console.log(`  ✅ ${image} → ${outputName}`)
      processed++
    } catch (error) {
      console.error(`  ❌ Hata: ${image}`, error)
    }
  }

  return processed
}

async function processSubfolders(
  rawFolder: string,
  outputFolder: string,
  type: 'products' | 'categories' | 'banners' | 'ads'
) {
  if (!fs.existsSync(rawFolder)) {
    return 0
  }

  let total = 0

  // Ana klasördeki görseller
  total += await processFolder(rawFolder, outputFolder, type)

  // Alt klasörler (örn: products-raw/kale-fileleri/)
  const items = fs.readdirSync(rawFolder, { withFileTypes: true })
  const subfolders = items.filter(item => item.isDirectory())

  for (const subfolder of subfolders) {
    const subRawPath = path.join(rawFolder, subfolder.name)
    const subOutputPath = path.join(outputFolder, subfolder.name)

    if (!fs.existsSync(subOutputPath)) {
      fs.mkdirSync(subOutputPath, { recursive: true })
    }

    console.log(`\n  📂 Alt klasör: ${subfolder.name}`)
    total += await processFolder(subRawPath, subOutputPath, type)
  }

  return total
}

async function main() {
  console.log('═══════════════════════════════════════════════════════')
  console.log('  🏷️  FILENES SPORTS - Otomatik Watermark Ekleme')
  console.log('═══════════════════════════════════════════════════════\n')

  // 1. Klasörleri oluştur
  await ensureDirectories()

  // 2. Logo'yu hazırla
  await prepareLogo()

  // 3. Ürün görselleri
  console.log('\n📦 ÜRÜN GÖRSELLERİ İŞLENİYOR...')
  const productCount = await processSubfolders(FOLDERS.rawProducts, FOLDERS.products, 'products')

  // 4. Kategori görselleri
  console.log('\n📁 KATEGORİ GÖRSELLERİ İŞLENİYOR...')
  const categoryCount = await processFolder(FOLDERS.rawCategories, FOLDERS.categories, 'categories')

  // 5. Banner görselleri
  console.log('\n🎨 BANNER GÖRSELLERİ İŞLENİYOR...')
  const bannerCount = await processFolder(FOLDERS.rawBanners, FOLDERS.banners, 'banners')

  // 6. Reklam görselleri
  console.log('\n📱 REKLAM GÖRSELLERİ İŞLENİYOR...')
  const adCount = await processFolder(FOLDERS.rawAds, FOLDERS.ads, 'ads')

  // Özet
  console.log('\n═══════════════════════════════════════════════════════')
  console.log('  📊 ÖZET')
  console.log('═══════════════════════════════════════════════════════')
  console.log(`  ✅ Ürün görselleri: ${productCount}`)
  console.log(`  ✅ Kategori görselleri: ${categoryCount}`)
  console.log(`  ✅ Banner görselleri: ${bannerCount}`)
  console.log(`  ✅ Reklam görselleri: ${adCount}`)
  console.log(`  ─────────────────────`)
  console.log(`  📷 TOPLAM: ${productCount + categoryCount + bannerCount + adCount} görsel işlendi`)
  console.log('═══════════════════════════════════════════════════════\n')

  if (productCount + categoryCount + bannerCount + adCount === 0) {
    console.log('💡 İPUCU: Görselleri şu klasörlere yükleyin:')
    console.log(`   - Ürünler: ${FOLDERS.rawProducts}/`)
    console.log(`   - Kategoriler: ${FOLDERS.rawCategories}/`)
    console.log(`   - Bannerlar: ${FOLDERS.rawBanners}/`)
    console.log(`   - Reklamlar: ${FOLDERS.rawAds}/`)
    console.log('\n   Sonra bu scripti tekrar çalıştırın!')
  }
}

main().catch(console.error)
