'use client'

import { useEffect, useState } from 'react'
import AuthPage from '@/components/screens/auth-page'
import App from '@/components/app-shell'
import SplashScreen from '@/components/screens/splash-screen'
import Onboarding from '@/components/screens/onboarding'
import { createClient } from '@miabega/api'

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldOnboard, setShouldOnboard] = useState(false)

  const checkOnboarding = async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', userId)
      .single()
    setShouldOnboard(data ? !data.onboarding_complete : false)
  }

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setIsAuthenticated(!!session)
      if (session) await checkOnboarding(session.user.id)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session)
      if (session) {
        await checkOnboarding(session.user.id)
      } else {
        setShouldOnboard(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = () => {
    // onAuthStateChange fires immediately after a successful sign-in/sign-up
    // and updates isAuthenticated/shouldOnboard, nothing to do here.
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  const handleOnboardingDone = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', session.user.id)
    }
    setShouldOnboard(false)
  }

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />
  }

  if (shouldOnboard) {
    return <Onboarding onDone={handleOnboardingDone} />
  }

  return <App onLogout={handleLogout} />
}
