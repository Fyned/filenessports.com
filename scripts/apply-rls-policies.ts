import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyRLSPolicies() {
  console.log('RLS politikaları uygulanıyor...\n')

  const policies = [
    // Products INSERT
    {
      name: 'Authenticated can insert products',
      sql: `CREATE POLICY "Authenticated can insert products" ON products FOR INSERT TO authenticated WITH CHECK (true);`
    },
    // Products UPDATE
    {
      name: 'Authenticated can update products',
      sql: `CREATE POLICY "Authenticated can update products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    },
    // Products DELETE
    {
      name: 'Authenticated can delete products',
      sql: `CREATE POLICY "Authenticated can delete products" ON products FOR DELETE TO authenticated USING (true);`
    },
    // Product Images INSERT
    {
      name: 'Authenticated can insert product_images',
      sql: `CREATE POLICY "Authenticated can insert product_images" ON product_images FOR INSERT TO authenticated WITH CHECK (true);`
    },
    // Product Images UPDATE
    {
      name: 'Authenticated can update product_images',
      sql: `CREATE POLICY "Authenticated can update product_images" ON product_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    },
    // Product Images DELETE
    {
      name: 'Authenticated can delete product_images',
      sql: `CREATE POLICY "Authenticated can delete product_images" ON product_images FOR DELETE TO authenticated USING (true);`
    },
    // Categories INSERT
    {
      name: 'Authenticated can insert categories',
      sql: `CREATE POLICY "Authenticated can insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);`
    },
    // Categories UPDATE
    {
      name: 'Authenticated can update categories',
      sql: `CREATE POLICY "Authenticated can update categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    },
    // Categories DELETE
    {
      name: 'Authenticated can delete categories',
      sql: `CREATE POLICY "Authenticated can delete categories" ON categories FOR DELETE TO authenticated USING (true);`
    },
    // Banners INSERT
    {
      name: 'Authenticated can insert banners',
      sql: `CREATE POLICY "Authenticated can insert banners" ON banners FOR INSERT TO authenticated WITH CHECK (true);`
    },
    // Banners UPDATE
    {
      name: 'Authenticated can update banners',
      sql: `CREATE POLICY "Authenticated can update banners" ON banners FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    },
    // Banners DELETE
    {
      name: 'Authenticated can delete banners',
      sql: `CREATE POLICY "Authenticated can delete banners" ON banners FOR DELETE TO authenticated USING (true);`
    },
    // Blog Posts INSERT
    {
      name: 'Authenticated can insert blog_posts',
      sql: `CREATE POLICY "Authenticated can insert blog_posts" ON blog_posts FOR INSERT TO authenticated WITH CHECK (true);`
    },
    // Blog Posts UPDATE
    {
      name: 'Authenticated can update blog_posts',
      sql: `CREATE POLICY "Authenticated can update blog_posts" ON blog_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);`
    },
    // Blog Posts DELETE
    {
      name: 'Authenticated can delete blog_posts',
      sql: `CREATE POLICY "Authenticated can delete blog_posts" ON blog_posts FOR DELETE TO authenticated USING (true);`
    },
  ]

  for (const policy of policies) {
    const { error } = await supabase.rpc('exec_sql', { sql: policy.sql }).single()

    if (error) {
      if (error.message.includes('already exists')) {
        console.log(`⏭️  ${policy.name} - zaten mevcut`)
      } else if (error.message.includes('function') || error.message.includes('rpc')) {
        // RPC yoksa doğrudan REST API ile dene
        console.log(`⚠️  ${policy.name} - RPC mevcut değil, manuel eklenmeli`)
      } else {
        console.log(`❌ ${policy.name} - Hata: ${error.message}`)
      }
    } else {
      console.log(`✅ ${policy.name} - eklendi`)
    }
  }

  console.log('\n---')
  console.log('NOT: Eğer RPC hatası aldıysanız, politikaları Supabase Dashboard > SQL Editor üzerinden manuel ekleyin.')
  console.log('SQL dosyası: supabase/migrations/005_product_rls_policies.sql')
}

applyRLSPolicies()
