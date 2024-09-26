import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getSupabaseAdminClient } from '@/utils/supabase/adminClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if the user is new
      const supabaseAdmin = getSupabaseAdminClient()
      const { data: existingUser, error: fetchError } = await supabaseAdmin
        .from('usuarios_servicio')
        .select('id')
        .eq('supabase_usuario', data.user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing user:', fetchError)
      }

      if (!existingUser) {
        // This is a new user, add them to usuarios_servicio
        const { error: insertError } = await supabaseAdmin
          .from('usuarios_servicio')
          .insert({
            supabase_usuario: data.user.id,
            name: data.user.user_metadata.full_name || data.user.email,
            // You might want to set default values for other fields
            role: 'user',
            expertise_level: 'beginner',
          })

        if (insertError) {
          console.error('Error inserting new user:', insertError)
        }
      }

      return NextResponse.redirect(`${new URL(request.url).origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${new URL(request.url).origin}/auth/auth-code-error`)
}