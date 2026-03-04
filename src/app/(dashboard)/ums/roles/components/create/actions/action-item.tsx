import { Translate } from '@/components/i18n';
import { CLR_GRAY_2 } from '@/lib/constants';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Link } from '@/uicomponents/link';
import { Switch } from '@/uicomponents/switch';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { IAction, IGroupPermissions, IPermission } from '../../../lib/types';
import { MessageDetails } from '../../../lib/utils';
import { getActionsEnumKey, getModuleEnumKey } from '../../../lib/utils/enum-mapper';
import HighlightedText from '../../../lib/utils/highlighted-text';
import {
  useDependanciesStore,
  useEditStore,
  useModulesStore,
  usePermissionsStore,
  useSelectedActionsStore,
  useSelectedPermissionsStore,
} from '../../../stores';
import { fetchPermissionsByActionId } from '../../../services';
import { PermissionsDrawer } from '../permission-drawer';

interface IActionItemProps {
  action: IAction;
  isLast: boolean;
}

export const ActionItem = ({ action, isLast }: IActionItemProps) => {
  const { isEditing, isEditAllowed } = useEditStore();
  const { selectedModule, selectedModuleId } = useModulesStore();
  const { setSelectedAction, removeSelectedAction, selectedActions } = useSelectedActionsStore();
  const { setSelectedPermissions, selectedPermissions } = useSelectedPermissionsStore();
  const { allPermissions, setPermissions } = usePermissionsStore();
  const { dependantActions } = useDependanciesStore();
  const queryClient = useQueryClient();

  const [isChecked, setIsChecked] = useState(false);
  const [isParentActionsChecked, setIsParentActionsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomized, setIsCustomized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if ((selectedActions[selectedModuleId as string] || []).includes(action.id)) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    checkIfParentActionsChecked();
  }, [selectedActions]);

  useEffect(() => {
    const permissions = allPermissions[action.id];
    const permissionIds = permissions?.flatMap((group: IGroupPermissions) =>
      group.attributes.map((perm: Record<string, string>) => perm.id),
    );
    setIsCustomized(permissionIds?.length > 0);
  }, [allPermissions]);

  const checkIfParentActionsChecked = () => {
    const parentActionId = action.dependsOnAction;
    if (parentActionId) {
      const enabledActionsOfCurrentModule = selectedActions[selectedModuleId as string] || [];
      const isParentActionEnabled = enabledActionsOfCurrentModule.includes(parentActionId);

      setIsParentActionsChecked(isParentActionEnabled);
    } else {
      setIsParentActionsChecked(true);
    }
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const moduleEnumKey = getModuleEnumKey(selectedModule as string);
  const actionEnumKey = getActionsEnumKey(action.value);
  const message = MessageDetails[moduleEnumKey!]?.[actionEnumKey];

  const fetchAndStorePermissions = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: queryKeys.roles.permissionsByAction(action.id, selectedModuleId as string),
      queryFn: async () => {
        const response = await fetchPermissionsByActionId(action.id, selectedModuleId as string);
        if (response.isError) throw new Error('Failed to fetch permissions');

        const permissionDependencies: Record<string, string[]> = {};
        response.data.forEach((group: IGroupPermissions) => {
          group.attributes.forEach((permission: IPermission) => {
            permission.actionsMapping = {
              parentAction: action.dependsOnAction,
              childrenActions: action.children,
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

    setPermissions(action.id, data);
    return data;
  };

  const onCheckedChange = async (isChecked: boolean) => {
    setIsLoading(true);
    try {
      if (isChecked) {
        setSelectedAction(selectedModuleId as string, action.id);
        const permissions = await fetchAndStorePermissions();
        const permissionIds = permissions.flatMap((group: IGroupPermissions) =>
          group.attributes
            .filter((perm: IPermission) => {
              if (perm.actionsMapping?.parentAction) {
                if (selectedPermissions[perm.actionsMapping?.parentAction]?.includes(perm.id)) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return true;
              }
            })
            .map((perm: IPermission) => perm.id),
        );
        setSelectedPermissions(action.id, permissionIds);
      } else {
        removeSelectedAction(selectedModuleId as string, action.id);
        setSelectedPermissions(action.id, []);
        switchOffDependentActions(action.id);
      }
    } catch (error) {}
    setIsLoading(false);
  };

  const switchOffDependentActions = (actionId: string) => {
    const dependentActions = dependantActions[actionId];
    if (dependentActions?.length) {
      dependentActions.forEach((dependentActionId) => {
        removeSelectedAction(selectedModuleId as string, dependentActionId);
        setSelectedPermissions(dependentActionId, []);
        switchOffDependentActions(dependentActionId);
      });
    }
  };

  return (
    <>
      <Flex gap='0.75rem' vertical>
        <Flex align='center' justify='space-between'>
          <Flex gap='0.75rem' align='center'>
            {isLoading ? (
              <LoadingOutlined />
            ) : (
              <Switch
                className={`action-item-switch ${isChecked ? 'checked' : ''}`}
                checked={isChecked}
                onChange={onCheckedChange}
                disabled={(!isEditAllowed && isEditing) || !isParentActionsChecked}
              />
            )}
            <HighlightedText text={message?.actionText || 'Default Action'} />
          </Flex>
          {isCustomized && isParentActionsChecked ? (
            <Link
              disabled={!isChecked}
              style={{ textDecoration: isChecked ? 'underline' : 'none' }}
              onClick={() => setOpenDrawer(true)}
            >
              <Translate i18nKey='Customize' />
            </Link>
          ) : null}
        </Flex>
        {!isLast && (
          <div
            style={{
              height: '1px',
              backgroundColor: CLR_GRAY_2,
              width: '100%',
            }}
          />
        )}
      </Flex>
      <PermissionsDrawer open={openDrawer} onClose={closeDrawer} actionId={action.id} />
    </>
  );
};
