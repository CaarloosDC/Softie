import { type EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = '/login' // Make sure this is set to '/login'

  console.log('Confirm route hit:', { token_hash, type, next })

  if (token_hash && type) {
    const supabase = createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    
    console.log('OTP verification result:', { error })

    if (!error) {
      // Redirect to login page after successful verification
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If there's an error or missing parameters, redirect to error page
  console.log('Redirecting to error page')
  return NextResponse.redirect(new URL('/error', request.url))
}