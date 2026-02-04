import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables!')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkAdminUsers() {
  console.log('\n=== ADMIN USER CHECK ===\n')

  // 1. Get all users from auth.users
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Error fetching auth users:', authError.message)
    return
  }

  console.log('Auth Users:')
  authUsers.users.forEach(user => {
    console.log(`  - ID: ${user.id}`)
    console.log(`    Email: ${user.email}`)
    console.log(`    Created: ${user.created_at}`)
    console.log('')
  })

  // 2. Get all user_profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('*')

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError.message)
    return
  }

  console.log('\nUser Profiles:')
  if (!profiles || profiles.length === 0) {
    console.log('  No profiles found!')
  } else {
    profiles.forEach(profile => {
      console.log(`  - ID: ${profile.id}`)
      console.log(`    Username: ${profile.username}`)
      console.log(`    Email: ${profile.email}`)
      console.log(`    Role: ${profile.role}`)
      console.log('')
    })
  }

  // 3. Check for ID mismatches
  console.log('\n=== ID MATCHING CHECK ===\n')
  const authIds = new Set(authUsers.users.map(u => u.id))
  const profileIds = new Set(profiles?.map(p => p.id) || [])

  const authUsersWithoutProfile = authUsers.users.filter(u => !profileIds.has(u.id))
  const profilesWithoutAuthUser = profiles?.filter(p => !authIds.has(p.id)) || []

  if (authUsersWithoutProfile.length > 0) {
    console.log('Auth users WITHOUT matching profile:')
    authUsersWithoutProfile.forEach(u => {
      console.log(`  - ${u.email} (${u.id})`)
    })
  } else {
    console.log('All auth users have matching profiles!')
  }

  if (profilesWithoutAuthUser.length > 0) {
    console.log('\nProfiles WITHOUT matching auth user:')
    profilesWithoutAuthUser.forEach(p => {
      console.log(`  - ${p.email} (${p.id})`)
    })
  }

  // 4. Check for admin users
  console.log('\n=== ADMIN USERS ===\n')
  const adminProfiles = profiles?.filter(p => p.role === 'admin') || []

  if (adminProfiles.length === 0) {
    console.log('No admin users found!')
    console.log('\nTo create an admin user, run:')
    console.log('  npx tsx scripts/create-admin.ts')
  } else {
    console.log('Admin users:')
    adminProfiles.forEach(admin => {
      const hasAuthUser = authIds.has(admin.id)
      console.log(`  - ${admin.email}`)
      console.log(`    ID: ${admin.id}`)
      console.log(`    Has matching auth user: ${hasAuthUser ? 'YES' : 'NO !!!'}`)
      console.log('')
    })
  }
}

checkAdminUsers().catch(console.error)
