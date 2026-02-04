import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function makeAdmin() {
  const userId = 'f7cf9665-c4eb-4aba-a88f-98c12aa461d1'
  const email = 'admin@fileenessports.com'
  const username = 'admin'

  console.log('Making user admin...')
  console.log('User ID:', userId)
  console.log('Email:', email)

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (existingProfile) {
    // Update existing profile to admin
    const { error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin', username })
      .eq('id', userId)

    if (error) {
      console.error('Error updating profile:', error)
      return
    }
    console.log('Profile updated to admin!')
  } else {
    // Create new profile with admin role
    const { error } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email,
        username,
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User'
      })

    if (error) {
      console.error('Error creating profile:', error)
      return
    }
    console.log('Admin profile created!')
  }

  // Verify
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('\nVerification:')
  console.log(profile)
}

makeAdmin().catch(console.error)
