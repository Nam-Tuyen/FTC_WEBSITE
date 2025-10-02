"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthStore, SessionUser } from "@/lib/auth";

type AuthCtx = {
  user: SessionUser | null;
  setUser: (u: SessionUser | null) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({ user: null, setUser: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<SessionUser | null>(null);

  useEffect(() => { setUserState(AuthStore.get()); }, []);
  const setUser = (u: SessionUser | null) => { setUserState(u); u ? AuthStore.save(u) : AuthStore.clear(); };
  const logout = () => setUser(null);

  return <Ctx.Provider value={{ user, setUser, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
