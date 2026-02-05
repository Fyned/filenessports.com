import { getSupabaseAdmin } from '@/lib/supabase/admin'

export interface SiteSettings {
  free_shipping_threshold: number
  default_shipping_cost: number
  site_name: string
  site_description: string
  phone: string
  email: string
  whatsapp: string
  address: string
  facebook: string
  instagram: string
  twitter: string
  youtube: string
}

const defaultSettings: SiteSettings = {
  free_shipping_threshold: 5000,
  default_shipping_cost: 49.90,
  site_name: 'Filenes Sports',
  site_description: 'Profesyonel Spor ve Güvenlik Fileleri',
  phone: '+90 541 885 56 76',
  email: 'info@fileenessports.com',
  whatsapp: '+905418855676',
  address: '',
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    // Check if supabaseAdmin is available (env vars set)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return defaultSettings
    }

    const supabaseAdmin = await getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('key, value')

    if (error || !data) {
      console.error('Error fetching site settings:', error)
      return defaultSettings
    }

    const settings = { ...defaultSettings }

    data.forEach((item) => {
      try {
        const key = item.key as keyof SiteSettings
        if (key in settings) {
          const parsedValue = JSON.parse(item.value)
          if (key === 'free_shipping_threshold' || key === 'default_shipping_cost') {
            settings[key] = Number(parsedValue) || defaultSettings[key]
          } else {
            (settings as Record<string, string | number>)[key] = parsedValue
          }
        }
      } catch {
        // JSON parse hatası, default değer kullan
      }
    })

    return settings
  } catch (error) {
    console.error('Error in getSiteSettings:', error)
    return defaultSettings
  }
}

export async function getSetting<K extends keyof SiteSettings>(
  key: K
): Promise<SiteSettings[K]> {
  const settings = await getSiteSettings()
  return settings[key]
}
