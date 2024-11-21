import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return redirect('/login')
  }

  return redirect('/projects')
}