import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ASYNC fonksiyon - her call'da yeni client yaratır, CACHE YOK
// Next.js 16 Server Components'de request isolation için gerekli
export async function getSupabaseAdmin(): Promise<SupabaseClient> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
