"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "./sheet"
import { STORAGE_KEYS } from "./constants"

type AuthStore = {
  user: AuthUser | null
  setUser: (user: AuthUser | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
    }),
    {
      name: STORAGE_KEYS.auth,
    },
  ),
)

