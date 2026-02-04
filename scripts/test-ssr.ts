import { createServerClient } from '@supabase/ssr'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function test() {
  // Simulate server component without cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )

  const { data, count, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, is_primary)
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(0, 11)

  console.log('Error:', error?.message)
  console.log('Count:', count)
  console.log('Products:', data?.length)
  if (data) {
    data.forEach(p => console.log(' -', p.name))
  }
}

test()
