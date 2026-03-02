import { create } from 'zustand';

interface ISelectedPermissionsState {
  selectedPermissions: Record<string, string[]>;
  setSelectedPermissions: (actionId: string, permissions: string[]) => void;
  setBulkSelectedPermissions: (permissions: Record<string, string[]>) => void;
  resetSelectedPermissions: () => void;
  getAllSelectedPermissions: () => string[];
}

export const useSelectedPermissionsStore = create<ISelectedPermissionsState>(
  (set, get) => ({
    selectedPermissions: {},

    setSelectedPermissions: (actionId, permissions) =>
      set((state) => ({
        selectedPermissions: {
          ...state.selectedPermissions,
          [actionId]: permissions,
        },
      })),

    setBulkSelectedPermissions: (permissions) =>
      set(() => ({
        selectedPermissions: permissions,
      })),

    resetSelectedPermissions: () =>
      set(() => ({
        selectedPermissions: {},
      })),

    getAllSelectedPermissions: () =>
      Object.values(get().selectedPermissions).flat(),
  }),
);
