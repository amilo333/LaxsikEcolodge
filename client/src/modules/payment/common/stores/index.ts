import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { TPaymentHandoff } from '../types';

type TPaymentStore = {
  handoff: TPaymentHandoff | null;
  setHandoff: (handoff: TPaymentHandoff) => void;
  clearHandoff: () => void;
};

export const usePaymentStore = create<TPaymentStore>()(
  persist(
    (set) => ({
      handoff: null,
      setHandoff: (handoff) => set({ handoff }),
      clearHandoff: () => set({ handoff: null }),
    }),
    {
      name: 'laxsik-payment-handoff',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ handoff: state.handoff }),
      skipHydration: true,
    }
  )
);
