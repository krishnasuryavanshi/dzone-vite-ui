import { create } from 'zustand';

interface IOldSelectedState {
  oldSelectedPermissions: string[];
  setOldSelectedPermissions: (permissions: string[]) => void;
  oldSelectedActions: string[];
  setOldSelectedActions: (actions: string[]) => void;
  resetOldSelectedStores: () => void;
}

export const useOldSelectedStore = create<IOldSelectedState>((set) => ({
  oldSelectedPermissions: [],
  setOldSelectedPermissions: (permissions) =>
    set({ oldSelectedPermissions: permissions }),

  oldSelectedActions: [],
  setOldSelectedActions: (actions) => set({ oldSelectedActions: actions }),

  resetOldSelectedStores: () =>
    set({ oldSelectedPermissions: [], oldSelectedActions: [] }),
}));
