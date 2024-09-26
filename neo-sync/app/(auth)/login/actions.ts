'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getSupabaseAdminClient as getAdminClient } from '../../../utils/supabase/adminClient' // Renamed import

export async function login(formData: FormData) {
    const supabase = createClient()

  
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    const { error } = await supabase.auth.signInWithPassword(data)
  
    if (error) {
      redirect('/error')
    }
  
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }
  
  export async function signup(formData: any) {
    const supabase = createClient()
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })
  
    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }
  
    if (authData.user) {
      // Insert additional user data into the service_users table
      const supabaseAdmin = getAdminClient();
      const { error: insertError } = await supabaseAdmin
        .from('usuarios_servicio')
        .insert({
          supabase_usuario: authData.user.id, 
          name: formData.name,
          role: formData.role,
          expertise_level: formData.expertiseLevel,
          phone: formData.phone,
        })
  
      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }
    }
  
    revalidatePath('/', 'layout')
    redirect('/registration-success')
  }

  export async function googleLogin() {
    const supabase = createClient()
    console.log("Starting Google OAuth process...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/dashboard`,
      },
    })
    
    if (error) {
      console.error('Google login error:', error)
      throw error
    }
    
    console.log("OAuth initiation successful, data:", data);
    return data
  }