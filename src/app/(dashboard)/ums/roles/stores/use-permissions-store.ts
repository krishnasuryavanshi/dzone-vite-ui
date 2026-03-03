import { create } from 'zustand';
import { IGroupPermissions } from '../lib/types';

interface IPermissionsState {
  allPermissions: Record<string, IGroupPermissions[]>;
  setPermissions: (actionId: string, permissions: IGroupPermissions[]) => void;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<IPermissionsState>((set) => ({
  allPermissions: {},

  setPermissions: (actionId, permissions) =>
    set((state) => ({
      allPermissions: { ...state.allPermissions, [actionId]: permissions },
    })),

  clearPermissions: () => set({ allPermissions: {} }),
}));
