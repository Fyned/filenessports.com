import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const settings = [
  { key: 'site_name', value: 'Filenes Sports' },
  { key: 'site_description', value: 'Profesyonel Spor ve Güvenlik Fileleri Üreticisi' },
  { key: 'phone', value: '0850 302 32 62' },
  { key: 'email', value: 'info@fileenessports.com' },
  { key: 'whatsapp', value: '905001234567' },
  { key: 'address', value: 'İstanbul, Türkiye' },
  { key: 'facebook', value: 'https://facebook.com/fileenessports' },
  { key: 'instagram', value: 'https://instagram.com/fileenessports' },
  { key: 'free_shipping_threshold', value: '500' },
  { key: 'default_shipping_cost', value: '29.90' },
]

async function seedSettings() {
  console.log('Site ayarları ekleniyor...')

  for (const setting of settings) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        key: setting.key,
        value: JSON.stringify(setting.value),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error(`Hata (${setting.key}):`, error.message)
    } else {
      console.log(`✓ ${setting.key}: ${setting.value}`)
    }
  }

  console.log('\nTamamlandı!')
}

seedSettings()
