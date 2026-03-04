import { Translate } from '@/components/i18n';
import { CLR_GRAY_2, CLR_GRAY_3 } from '@/lib/constants';
import { Flex, Space } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { IAction, IRoleDetails, IGroupPermissions, IPermission } from '../../../lib/types';
import {
  useEditStore,
  useModulesStore,
  usePermissionsStore,
  useSelectedPermissionsStore,
} from '../../../stores';
import { fetchPermissionsByActionId } from '../../../services';
import { useDependanciesStore } from '../../../stores/use-dependancy-store';
import { ActionItem } from './action-item';
import { debounce } from 'lodash';

interface IActionsProps {
  roleDetails: IRoleDetails;
}
export const Actions: FC<IActionsProps> = ({ roleDetails }) => {
  const [actions, setActions] = useState<IAction[]>([]);
  const { selectedModule, selectedModuleId, getActionsForModule } = useModulesStore();
  const { isEditing } = useEditStore();
  const { setPermissions } = usePermissionsStore();
  const { selectedPermissions } = useSelectedPermissionsStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedModule) {
      const fetchedActions = getActionsForModule(selectedModule);
      setActions(fetchedActions);
      if (isEditing) {
        const activeActions = fetchedActions
          .map((action) => ({
            id: action.id,
            dependsOnAction: action.dependsOnAction,
            children: action.children,
          }))
          .filter(({ id }) => {
            return selectedPermissions[id]?.length > 0;
          });
        if (activeActions.length > 0) {
          debouncedFetchPermissionsForActiveActions(activeActions);
        }
      }
    }
  }, [selectedModule, isEditing]);

  const fetchPermissionsForActiveActions = async (actions: Record<string, any>[]) => {
    const permissionsPromises = actions.map(async ({ id, dependsOnAction, children }) => {
      const data = await queryClient.fetchQuery({
        queryKey: queryKeys.roles.permissionsByAction(id, selectedModuleId as string),
        queryFn: async () => {
          const response = await fetchPermissionsByActionId(id, selectedModuleId as string);
          if (response.isError) throw new Error('Failed to fetch permissions');

          const permissionDependencies: Record<string, string[]> = {};
          response.data.forEach((group: IGroupPermissions) => {
            group.attributes.forEach((permission: IPermission) => {
              permission.actionsMapping = {
                parentAction: dependsOnAction,
                childrenActions: children,
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
      });
      setPermissions(id, data);
      return data;
    });

    await Promise.all(permissionsPromises);
  };

  const debouncedFetchPermissionsForActiveActions = debounce(fetchPermissionsForActiveActions, 500);

  return (
    <Flex gap='0.75rem' vertical>
      <Space style={{ color: CLR_GRAY_3, fontWeight: 700 }}>
        <Translate i18nKey='pages.rolesAndPermissions.label.actionsHeading' />
      </Space>
      <Flex
        vertical
        gap='0.75rem'
        style={{
          border: `1px solid ${CLR_GRAY_2}`,
          borderRadius: '0.5rem',
          padding: '0.75rem',
          width: '75%',
        }}
      >
        {actions?.map((action, index) => {
          return (
            <ActionItem key={action.id} action={action} isLast={index === actions.length - 1} />
          );
        })}
      </Flex>
    </Flex>
  );
};
