import { create } from 'zustand';

interface Store {
  isEditing: boolean;
  isEditAllowed: boolean;
  setIsEditing: (status: boolean) => void;
  setIsEditAllowed: (status: boolean) => void;
}

export const useEditStore = create<Store>((set) => ({
  isEditing: false,
  isEditAllowed: false,

  setIsEditing: (status: boolean) => set({ isEditing: status }),
  setIsEditAllowed: (status: boolean) => set({ isEditAllowed: status }),
}));
