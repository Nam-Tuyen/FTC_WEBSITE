'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { AuthError, createClient, Session, User } from '@supabase/supabase-js'

// Lazily create the Supabase client on the client side to avoid
// throwing during server-side imports when env vars are not present.
// The client is stored in a ref and created inside useEffect.

interface AuthContextType {
  user: User | null
  session: Session | null
  signOut: () => Promise<{ error: AuthError | null }>
  signInWithGithub: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabaseRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      console.warn('Supabase env vars missing. Auth features disabled.')
      // If no supabase config provided, don't attempt auth actions
      setLoading(false)
      return
    }

    // Lazily create the client for the browser
    supabaseRef.current = createClient(url, key)

    // Get session from storage
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabaseRef.current.auth.getSession()
        if (mounted) {
          if (error) {
            console.error('Error getting session:', error.message)
          } else {
            setSession(session)
            setUser(session?.user ?? null)
          }
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to get session:', err)
          setLoading(false)
        }
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange((_event: any, session: any) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      try { subscription.unsubscribe() } catch (e) { /* ignore */ }
    }
  }, [])

  const value = {
    user,
    session,
    signOut: async () => {
      if (!supabaseRef.current) {
        console.warn('signOut called but Supabase is not configured.')
        return { error: null }
      }
      return supabaseRef.current.auth.signOut()
    },
    signInWithGithub: async () => {
      if (!supabaseRef.current) {
        console.warn('signInWithGithub called but Supabase is not configured.')
        return
      }
      const { error } = await supabaseRef.current.auth.signInWithOAuth({ provider: 'github' })
      if (error) {
        console.error('Error signing in with Github:', error.message)
      }
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
