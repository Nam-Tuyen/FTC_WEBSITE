export type SessionUser = { mssv: string; full_name: string; email: string; userId: string };

const KEY = "forum_user";

export const AuthStore = {
  save(u: SessionUser) { localStorage.setItem(KEY, JSON.stringify(u)); },
  get(): SessionUser | null {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  },
  clear() { localStorage.removeItem(KEY); }
};
