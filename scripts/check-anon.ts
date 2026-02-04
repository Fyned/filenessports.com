import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// ANON KEY ile test (public erişim)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function check() {
  console.log('Testing with ANON KEY...')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

  const { data, error, count } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary)
    `, { count: 'exact' })
    .eq('is_active', true)

  if (error) {
    console.log('Hata:', error.message)
    console.log('Full error:', error)
  } else {
    console.log('Ürün sayısı:', count)
    console.log('Ürünler:', JSON.stringify(data?.map(p => ({ name: p.name, is_active: p.is_active })), null, 2))
  }
}

check()
