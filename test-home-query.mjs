import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
  // Fetch all active categories
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name, slug, image, description')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  console.log('Categories:', categories?.length, categories?.map(c => c.slug))
  
  const kaleCategory = categories?.find(c => c.slug === 'kale-fileleri')
  console.log('Kale Category:', kaleCategory?.id)
  
  if (kaleCategory) {
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('id, name, slug, price, compare_price, images, short_description, is_new, is_featured')
      .eq('is_active', true)
      .eq('category_id', kaleCategory.id)
      .order('created_at', { ascending: false })
      .limit(8)
    
    console.log('Kale Products:', products?.length)
    if (prodError) console.log('Error:', prodError)
  }
}

test()
