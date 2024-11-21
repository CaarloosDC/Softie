// components/global/navbar-wrapper.tsx
import { createClient } from '@/utils/supabase/server'
import { Navbar } from './navbar'

export async function NavbarWrapper() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let name = user?.user_metadata?.full_name || 'User'
  let email = user?.email || ''
  let avatarUrl = user?.user_metadata?.avatar_url || ''

  // If you need more detailed user info from usuario_servicio table
  if (user) {
    const { data, error } = await supabase
      .from('usuario_servicio')
      .select('name, email')
      .eq('supabase_usuario', user.id)
      .single()

    if (data && !error) {
      name = data.name || name
      email = data.email || email
    }
  }

  return <Navbar userName={name} userEmail={email} avatarUrl={avatarUrl} />
}