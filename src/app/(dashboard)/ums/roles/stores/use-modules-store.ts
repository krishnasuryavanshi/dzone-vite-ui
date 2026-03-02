import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { IAction, IModule } from '../lib/types';
import { fetchAllModules } from '../services';
import { useDependanciesStore } from './use-dependancy-store';

interface IModulesState {
  modules: Record<string, IModule> | null;
  selectedModule: string | null;
  setSelectedModule: (name: string) => void;
  selectedModuleId: string | null; // setting separately so that existing implementation won't break
  setSelectedModuleId: (id: string) => void;
  fetchModules: () => Promise<void>;
  getModuleName: (moduleName: string) => string;
  getActionsForModule: (moduleName: string | null) => IAction[];
}

export const useModulesStore = create<IModulesState>()(
  immer((set, get) => ({
    modules: null,
    selectedModule: null,
    selectedModuleId: null,

    setSelectedModule: (name) => set({ selectedModule: name }),
    setSelectedModuleId: (id) => set({ selectedModuleId: id }),

    fetchModules: async () => {
      const response = await fetchAllModules();
      if (response.isError) {
        return;
      }

      const actionsDependacies: Record<string, string[]> = {};
      const modulesData = response.data.reduce(
        (acc: { [x: string]: any }, roleModule: IModule) => {
          roleModule?.actions.forEach((action) => {
            if (action.children?.length) {
              actionsDependacies[action.id] = action.children;
            }
          });
          acc[roleModule.name] = roleModule;
          return acc;
        },
        {} as Record<string, IModule>,
      );

      const setDependantAction =
        useDependanciesStore.getState().setDependantAction;
      setDependantAction(actionsDependacies);

      set((state) => {
        state.modules = modulesData;
      });
    },

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
