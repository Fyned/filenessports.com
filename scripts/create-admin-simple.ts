/**
 * Basit Admin Kullanıcı Oluşturma Script'i
 * user_profiles tablosu olmadan çalışır
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const adminEmail = 'admin@fileatolyesi.com'
  const adminPassword = 'admin123'

  console.log('🚀 Admin kullanıcı oluşturuluyor...\n')

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u) => u.email === adminEmail)

    if (existingUser) {
      console.log('ℹ️  Admin kullanıcı zaten mevcut:', adminEmail)
      console.log('   User ID:', existingUser.id)
      return
    }

    // Create new admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
      },
    })

    if (createError) {
      console.error('❌ Kullanıcı oluşturulurken hata:', createError.message)
      return
    }

    console.log('✅ Admin kullanıcı oluşturuldu!')
    console.log('   User ID:', newUser.user?.id)

    console.log('\n========================================')
    console.log('Admin Giriş Bilgileri:')
    console.log('========================================')
    console.log('E-posta:', adminEmail)
    console.log('Şifre:', adminPassword)
    console.log('========================================\n')
  } catch (error) {
    console.error('❌ Beklenmeyen hata:', error)
  }
}

createAdminUser()
