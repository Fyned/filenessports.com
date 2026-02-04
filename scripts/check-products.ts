import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function check() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, is_active, category_id, price')
    .limit(10)

  if (error) {
    console.log('Hata:', error.message)
  } else {
    console.log('Ürünler:', JSON.stringify(data, null, 2))
    console.log('Toplam:', data?.length)
  }
}

check()
