'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { AuthError, createClient, Session, User } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  useEffect(() => {
    let mounted = true

    // Get session from storage
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (mounted) {
        if (error) {
          console.error('Error getting session:', error.message)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    session,
    signOut: () => supabase.auth.signOut(),
    signInWithGithub: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github'
      })
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
