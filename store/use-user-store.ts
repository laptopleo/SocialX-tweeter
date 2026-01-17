/**
 * ⚡ ZUSTAND STORE - ULTRA RÁPIDO
 *
 * Gestión de estado global sin re-renders innecesarios
 */

import { UserType } from "@/types/user.type";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  currentUser: UserType | null;
  isLoading: boolean;

  // Actions
  setCurrentUser: (user: UserType | null) => void;
  setLoading: (loading: boolean) => void;
  updateUser: (updates: Partial<UserType>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        isLoading: true,

        setCurrentUser: (user) => set({ currentUser: user, isLoading: false }),

        setLoading: (loading) => set({ isLoading: loading }),

        updateUser: (updates) =>
          set((state) => ({
            currentUser: state.currentUser ? { ...state.currentUser, ...updates } : null,
          })),

        clearUser: () => set({ currentUser: null, isLoading: false }),
      }),
      {
        name: "user-storage", // Nombre en localStorage
        partialize: (state) => ({ currentUser: state.currentUser }), // Solo persistir currentUser
      }
    ),
    { name: "UserStore" }
  )
);
