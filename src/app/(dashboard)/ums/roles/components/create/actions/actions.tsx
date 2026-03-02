import { Translate } from '@/components/i18n';
import { CLR_GRAY_2, CLR_GRAY_3 } from '@/lib/constants';
import { Flex, Space } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { IAction, IRoleDetails } from '../../../lib/types';
import {
  useEditStore,
  useModulesStore,
  usePermissionsStore,
  useSelectedPermissionsStore,
} from '../../../stores';
import { ActionItem } from './action-item';
import { debounce } from 'lodash';

interface IActionsProps {
  roleDetails: IRoleDetails;
}
export const Actions: FC<IActionsProps> = ({ roleDetails }) => {
  const [actions, setActions] = useState<IAction[]>([]);
  const { selectedModule, selectedModuleId, getActionsForModule } =
    useModulesStore();
  const { isEditing } = useEditStore();
  const { fetchAllPermissions } = usePermissionsStore();
  const { selectedPermissions } = useSelectedPermissionsStore();

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

  const fetchPermissionsForActiveActions = async (
    actions: Record<string, any>[],
  ) => {
    const permissionsPromises = actions.map(
      ({ id, dependsOnAction, children }) =>
        fetchAllPermissions(
          id,
          selectedModuleId as string,
          dependsOnAction,
          children,
        ),
    );

    await Promise.all(permissionsPromises);
  };

  const debouncedFetchPermissionsForActiveActions = debounce(
    fetchPermissionsForActiveActions,
    500,
  );

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
        }}>
        {actions?.map((action, index) => {
          return (
            <ActionItem
              key={action.id}
              action={action}
              isLast={index === actions.length - 1}
            />
          );
        })}
      </Flex>
    </Flex>
  );
};
