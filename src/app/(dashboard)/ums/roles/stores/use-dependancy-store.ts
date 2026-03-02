import { create } from 'zustand';

interface IDependanciesStore {
  dependantActions: Record<string, string[]>;
  setDependantAction: (dependantActions: Record<string, string[]>) => void;
  dependantPermissions: Record<string, string[]>;
  setDependantPermissions: (
    dependantPermissions: Record<string, string[]>,
  ) => void;
}

export const useDependanciesStore = create<IDependanciesStore>((set, get) => ({
  dependantActions: {},
  dependantPermissions: {},

  setDependantAction: (dependantActions) =>
    set((state) => ({
      dependantActions: dependantActions,
    })),

  setDependantPermissions: (dependantPermissions) =>
    set((state) => ({
      dependantPermissions: {
        ...get().dependantPermissions,
        ...dependantPermissions,
      },
    })),
}));
