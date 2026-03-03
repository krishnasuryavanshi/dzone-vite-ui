import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IAction, IModule } from '../lib/types';

interface IModulesState {
  modules: Record<string, IModule> | null;
  setModules: (modules: Record<string, IModule>) => void;
  selectedModule: string | null;
  setSelectedModule: (name: string) => void;
  selectedModuleId: string | null; // setting separately so that existing implementation won't break
  setSelectedModuleId: (id: string) => void;
  getModuleName: (moduleName: string) => string;
  getActionsForModule: (moduleName: string | null) => IAction[];
}

export const useModulesStore = create<IModulesState>()(
  immer((set, get) => ({
    modules: null,
    selectedModule: null,
    selectedModuleId: null,

    setModules: (modules) =>
      set((state) => {
        state.modules = modules;
      }),
    setSelectedModule: (name) => set({ selectedModule: name }),
    setSelectedModuleId: (id) => set({ selectedModuleId: id }),

    getModuleName: (moduleName) => {
      const roleModule = get().modules?.[moduleName ?? ''];
      return roleModule?.name ?? '';
    },

    getActionsForModule: (moduleName) => {
      const roleModule = get().modules?.[moduleName ?? ''];
      if (!roleModule) return [];
      return [...roleModule.actions];
    },
  })),
);
