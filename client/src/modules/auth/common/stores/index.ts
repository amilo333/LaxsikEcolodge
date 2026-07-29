import { create } from 'zustand';
import { TUser } from '../types';

type TAuthStore = {
  user: TUser | null;
  setUser: (user: TUser) => void;

  reset: () => void;
};

export const useAuthStore = create<TAuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  reset: () => set({ user: null }),
}));
