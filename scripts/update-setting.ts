import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function run() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 20) + '...')

  // Read current
  const { data: current, error: readErr } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'free_shipping_threshold')
    .single()

  console.log('\nCurrent record:', current)
  if (readErr) console.log('Read error:', readErr)

  // Update
  const { data, error, count } = await supabase
    .from('site_settings')
    .update({ value: '750' })
    .eq('key', 'free_shipping_threshold')
    .select()

  console.log('\nUpdate result:', data)
  console.log('Count:', count)
  if (error) console.log('Update error:', error)

  // Verify
  const { data: after } = await supabase
    .from('site_settings')
    .select('*')
    .eq('key', 'free_shipping_threshold')
    .single()

  console.log('\nAfter update:', after)
}

run()
