import { create } from 'zustand';
import { IGroupPermissions, IPermission } from '../lib/types';
import { fetchPermissionsByActionId } from '../services';
import { useDependanciesStore } from './use-dependancy-store';

interface IPermissionsState {
  allPermissions: Record<string, IGroupPermissions[]>;
  fetchAllPermissions: (
    actionId: string,
    moduleId: string,
    parentActionId?: string,
    childrenActionIds?: string[],
  ) => Promise<Record<string, any>>;
}
export const usePermissionsStore = create<IPermissionsState>((set, get) => ({
  allPermissions: {},

  fetchAllPermissions: async (
    actionId,
    moduleId,
    parentActionId,
    childrenActionIds,
  ) => {
    try {
      if (get().allPermissions[actionId]) {
        return get().allPermissions[actionId];
      }

      const response = await fetchPermissionsByActionId(actionId, moduleId);
      if (response.isError) {
        return [];
      }

      const permissionDependacies: Record<string, string[]> = {};
      response.data.forEach((group: IGroupPermissions) => {
        group.attributes.forEach((permission: IPermission) => {
          permission.actionsMapping = {
            parentAction: parentActionId,
            childrenActions: childrenActionIds,
          };
          if (permission?.children?.length) {
            permissionDependacies[permission.id] = permission?.children;
          }
        });
      });

      const setDependantPermissions =
        useDependanciesStore.getState().setDependantPermissions;
      setDependantPermissions(permissionDependacies);

      set((state) => ({
        allPermissions: { ...state.allPermissions, [actionId]: response.data },
      }));
      return response.data;
    } catch (error) {}
  },
}));
