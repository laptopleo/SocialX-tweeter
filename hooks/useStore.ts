import { create, StateCreator } from "zustand";

type BirthDaySlice = {
  isBirthDayModalOpen: boolean;
  onOpenBirthDayModal: () => void;
  onCloseBirthDayModal: () => void;
};

const createBirthDaySlice: StateCreator<BirthDaySlice, [], [], BirthDaySlice> = (set) => ({
  isBirthDayModalOpen: false,
  onOpenBirthDayModal: () => set({ isBirthDayModalOpen: true }),
  onCloseBirthDayModal: () => set({ isBirthDayModalOpen: false }),
});

type EditModalSlice = {
  isEditModalOpen: boolean;
  onOpenEditModal: () => void;
  onCloseEditModal: () => void;
};

const createEditModalSlice: StateCreator<EditModalSlice, [], [], EditModalSlice> = (set) => ({
  isEditModalOpen: false,
  onOpenEditModal: () => set({ isEditModalOpen: true }),
  onCloseEditModal: () => set({ isEditModalOpen: false }),
});

// Pro Modal slice
type ProModalSlice = {
  isProModalOpen: boolean;
  onOpenProModal: () => void;
  onCloseProModal: () => void;
};

const createProModalSlice: StateCreator<ProModalSlice, [], [], ProModalSlice> = (set) => ({
  isProModalOpen: false,
  onOpenProModal: () => set({ isProModalOpen: true }),
  onCloseProModal: () => set({ isProModalOpen: false }),
});

// Features Modal slice
type FeaturesModalSlice = {
  isFeaturesModalOpen: boolean;
  onOpenFeaturesModal: () => void;
  onCloseFeaturesModal: () => void;
};

const createFeaturesModalSlice: StateCreator<FeaturesModalSlice, [], [], FeaturesModalSlice> = (
  set
) => ({
  isFeaturesModalOpen: false,
  onOpenFeaturesModal: () => set({ isFeaturesModalOpen: true }),
  onCloseFeaturesModal: () => set({ isFeaturesModalOpen: false }),
});

// About Modal slice
type AboutModalSlice = {
  isAboutModalOpen: boolean;
  onOpenAboutModal: () => void;
  onCloseAboutModal: () => void;
};

const createAboutModalSlice: StateCreator<AboutModalSlice, [], [], AboutModalSlice> = (set) => ({
  isAboutModalOpen: false,
  onOpenAboutModal: () => set({ isAboutModalOpen: true }),
  onCloseAboutModal: () => set({ isAboutModalOpen: false }),
});

type StoreType = BirthDaySlice &
  EditModalSlice &
  ProModalSlice &
  FeaturesModalSlice &
  AboutModalSlice;

//Combine the slices into a single
export const useStore = create<StoreType>()((...a) => ({
  ...createBirthDaySlice(...a),
  ...createEditModalSlice(...a),
  ...createProModalSlice(...a),
  ...createFeaturesModalSlice(...a),
  ...createAboutModalSlice(...a),
}));
