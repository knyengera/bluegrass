import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (user: User | null, token: string | null, refreshToken: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoading: true,
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
    }),
    {
      name: 'pantry-auth-storage',
    }
  )
);
