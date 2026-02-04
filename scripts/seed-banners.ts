import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const banners = [
  {
    title: 'Profesyonel Spor Fileleri',
    subtitle: 'Türkiye\'nin 1 numaralı file üreticisi. Kaliteli malzeme, uygun fiyat, hızlı teslimat!',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=800&fit=crop',
    link: '/urunler',
    button_text: 'Ürünleri İncele',
    position: 'hero',
    is_active: true,
    sort_order: 1,
    background_color: '#1C2840',
    text_color: '#FFFFFF',
  },
  {
    title: 'Futbol Kale Fileleri',
    subtitle: 'Profesyonel sahalardan amatör liglere, her boyutta kale filesi üretimi',
    image_url: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920&h=800&fit=crop',
    link: '/kategori/futbol-fileleri',
    button_text: 'Keşfet',
    position: 'hero',
    is_active: true,
    sort_order: 2,
    background_color: '#1C2840',
    text_color: '#FFFFFF',
  },
  {
    title: 'Özel Sipariş Fırsatı',
    subtitle: 'İstediğiniz ölçüde, istediğiniz renkte file üretimi. Hemen teklif alın!',
    image_url: 'https://images.unsplash.com/photo-1461896836934- voices-in-the-dark?w=1920&h=800&fit=crop',
    link: '/iletisim',
    button_text: 'Teklif Al',
    position: 'hero',
    is_active: true,
    sort_order: 3,
    background_color: '#BB1624',
    text_color: '#FFFFFF',
  },
]

async function seedBanners() {
  console.log('Seeding banners...')

  // Clear existing hero banners
  const { error: deleteError } = await supabase
    .from('banners')
    .delete()
    .eq('position', 'hero')

  if (deleteError) {
    console.error('Error deleting existing banners:', deleteError)
  }

  // Insert new banners
  const { data, error } = await supabase
    .from('banners')
    .insert(banners)
    .select()

  if (error) {
    console.error('Error inserting banners:', error)
    return
  }

  console.log('Banners seeded successfully:', data?.length)
}

seedBanners()
