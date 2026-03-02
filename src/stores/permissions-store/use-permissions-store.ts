import { DzRecord } from '@/lib/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ModuleAccess {
  module: {
    name: string;
    access: string[];
  };
}

interface IFieldDataProps {
  moduleName: string;
  attributes: { name: string; accesses: string[] }[];
}

interface IPermissionsState {
  modules: DzRecord[];
  accesses: Record<string, boolean>;
  attributes: Record<string, Record<string, string[]>>;
  setModules: (modules: DzRecord[]) => void;
  setAccesses: (allPermissions: Record<string, boolean>) => void;
  setAttributes: (fieldData: IFieldDataProps[]) => void;
  clearPermissions: () => void;
}

export const usePermissionsStore = create<IPermissionsState>()(
  persist(
    (set) => ({
      modules: [],
      accesses: {},
      attributes: {},
      setModules: (modules: DzRecord[]) => {
        set({ modules });
      },
      setAccesses: (modules: Record<string, boolean>) => {
        set({ accesses: modules });
      },
      setAttributes: (fieldData: IFieldDataProps[]) => {
        if (!fieldData?.length) return;

        set((state) => {
          const updatedAttributes = { ...state.attributes };

          fieldData.forEach((module) => {
            if (!module.moduleName) return;
            const modulePermissions = module?.attributes?.reduce(
              (acc: Record<string, string[]>, attr) => {
                acc[attr.name] = attr.accesses;
                return acc;
              },
              {},
            );
            updatedAttributes[module.moduleName] = modulePermissions;
          });

          return { attributes: updatedAttributes };
        });
      },
      clearPermissions: () => {
        set({ accesses: {}, attributes: {} });
        localStorage.removeItem('permissions-storage');
      },
    }),
    {
      name: 'permissions-storage',
      storage:
        typeof window !== 'undefined' && window.localStorage
          ? createJSONStorage(() => localStorage)
          : createJSONStorage(() => ({
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            })),
    },
  ),
);
