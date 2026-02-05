import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern for admin client
let adminClient: SupabaseClient | null = null

// ASYNC fonksiyon - Next.js 16 Server Components için
export async function getSupabaseAdmin(): Promise<SupabaseClient> {
  // Return cached client if exists
  if (adminClient) {
    return adminClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Service key yoksa anon key kullan (public data için)
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey
    })
    throw new Error('Supabase yapılandırması eksik')
  }

  adminClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  return adminClient
}
