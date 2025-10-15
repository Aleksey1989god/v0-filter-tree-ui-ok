import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "user"

export interface User {
  username: string
  role: UserRole
}

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      isAuthenticated: () => get().user !== null,
    }),
    {
      name: "auth-storage",
    },
  ),
)
