"use client"
import { createContext, useContext } from 'react'

type AuthError = { message?: string } | null

type Session = null

type User = null

interface AuthContextType {
  user: User
  session: Session
  signOut: () => Promise<{ error: AuthError }>
  signInWithGithub: () => Promise<void>
}

const defaultAuthValue: AuthContextType = {
  user: null,
  session: null,
  signOut: async () => ({ error: null }),
  signInWithGithub: async () => {}
}

const AuthContext = createContext<AuthContextType>(defaultAuthValue)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={defaultAuthValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
