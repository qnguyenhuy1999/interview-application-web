'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { id: string; email: string } | null;
  setAuth: (token: string, user: { id: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-storage',
      // Lazy initialization: skipHydrate prevents localStorage reads on store creation
      skipHydration: true,
    }
  )
);

// Client-side hydration: populate state from localStorage once on mount
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.state) {
        useAuthStore.setState({
          token: parsed.state.token ?? null,
          user: parsed.state.user ?? null,
        });
      }
    } catch {
      // Ignore parse errors
    }
  }
}
