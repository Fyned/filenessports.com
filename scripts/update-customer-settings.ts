import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const updates: { key: string; value: string }[] = [
  { key: 'whatsapp', value: '905418855676' },
  { key: 'phone', value: '+90 541 885 56 76' },
  { key: 'free_shipping_threshold', value: '0' },
  { key: 'default_shipping_cost', value: '0' },
]

async function run() {
  console.log('Updating customer settings...\n')

  for (const { key, value } of updates) {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('key')
      .eq('key', key)
      .maybeSingle()

    const payload = {
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString(),
    }

    const { error } = existing
      ? await supabase.from('site_settings').update(payload).eq('key', key)
      : await supabase.from('site_settings').insert(payload)

    if (error) {
      console.error(`X ${key}:`, error.message)
    } else {
      console.log(`OK ${key} -> ${value}`)
    }
  }

  console.log('\nDone.')
}

run()
