/**
 * ⚡ UI STORE - Estado de la interfaz
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  // Modals
  isPostModalOpen: boolean;
  isEditProfileModalOpen: boolean;
  isProModalOpen: boolean;

  // Mobile
  isMobileSidebarOpen: boolean;

  // Actions
  openPostModal: () => void;
  closePostModal: () => void;
  openEditProfileModal: () => void;
  closeEditProfileModal: () => void;
  openProModal: () => void;
  closeProModal: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isPostModalOpen: false,
      isEditProfileModalOpen: false,
      isProModalOpen: false,
      isMobileSidebarOpen: false,

      openPostModal: () => set({ isPostModalOpen: true }),
      closePostModal: () => set({ isPostModalOpen: false }),

      openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
      closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),

      openProModal: () => set({ isProModalOpen: true }),
      closeProModal: () => set({ isProModalOpen: false }),

      toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),

      closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
    }),
    { name: "UIStore" }
  )
);
