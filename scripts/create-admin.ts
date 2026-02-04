/**
 * Admin Kullanıcı Oluşturma Script'i
 *
 * Bu script'i çalıştırmadan önce:
 * 1. .env.local dosyasında SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı
 * 2. supabase/migrations/002_user_profiles.sql Supabase'de çalıştırılmış olmalı
 *
 * Çalıştırmak için:
 * npx tsx scripts/create-admin.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı!')
  console.log('\n.env.local dosyasına ekleyin:')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  process.exit(1)
}

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

      // Update role to admin if not already
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          id: existingUser.id,
          email: adminEmail,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
        })

      if (updateError) {
        console.error('❌ Rol güncellenirken hata:', updateError.message)
      } else {
        console.log('✅ Admin rolü güncellendi')
      }
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
      },
    })

    if (createError) {
      console.error('❌ Kullanıcı oluşturulurken hata:', createError.message)
      return
    }

    console.log('✅ Kullanıcı oluşturuldu:', newUser.user?.email)

    // Wait a bit for the trigger to create the profile
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update role to admin
    const { error: roleError } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('id', newUser.user?.id)

    if (roleError) {
      // If profile doesn't exist, create it
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          id: newUser.user?.id,
          email: adminEmail,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
        })

      if (insertError) {
        console.error('❌ Profil oluşturulurken hata:', insertError.message)
      } else {
        console.log('✅ Admin profili oluşturuldu')
      }
    } else {
      console.log('✅ Admin rolü atandı')
    }

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
