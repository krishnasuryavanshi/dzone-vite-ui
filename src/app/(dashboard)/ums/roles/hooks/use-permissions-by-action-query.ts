import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPermissionsByActionId } from '../services';
import { IGroupPermissions, IPermission } from '../lib/types';
import { useDependanciesStore } from '../stores/use-dependancy-store';

export function usePermissionsByActionQuery(
  actionId: string,
  moduleId: string,
  parentActionId?: string,
  childrenActionIds?: string[],
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.roles.permissionsByAction(actionId, moduleId),
    queryFn: async () => {
      const response = await fetchPermissionsByActionId(actionId, moduleId);
      if (response.isError) throw new Error('Failed to fetch permissions');

      const permissionDependencies: Record<string, string[]> = {};
      response.data.forEach((group: IGroupPermissions) => {
        group.attributes.forEach((permission: IPermission) => {
          permission.actionsMapping = {
            parentAction: parentActionId,
            childrenActions: childrenActionIds,
          };
          if (permission?.children?.length) {
            permissionDependencies[permission.id] = permission.children;
          }
        });
      });

      useDependanciesStore.getState().setDependantPermissions(permissionDependencies);
      return response.data as IGroupPermissions[];
    },
    staleTime: 30 * 60 * 1000,
    enabled: !!actionId && !!moduleId && enabled,
  });
}
