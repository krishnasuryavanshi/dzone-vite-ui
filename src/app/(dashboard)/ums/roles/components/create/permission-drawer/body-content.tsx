import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { IGroupPermissions, IPermission } from '../../../lib/types';
import {
  usePermissionsStore,
  useSelectedPermissionsStore,
} from '../../../stores';
import { PermissionGroupName } from './permission-group-name';
import { PermissionSearchInput } from './permission-search-input';
import { PermissionsCheckboxContainer } from './permissions-checkbox-container';

interface IBodyContent {
  open: boolean;
  onClose: () => void;
  actionId: string;
}

export const BodyContent: FC<IBodyContent> = ({ open, onClose, actionId }) => {
  const { allPermissions } = usePermissionsStore();
  const [permissions, setPermissions] = useState<IGroupPermissions[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { selectedPermissions, setSelectedPermissions } =
    useSelectedPermissionsStore();

  useEffect(() => {
    if (open && actionId && allPermissions) {
      setPermissions(allPermissions[actionId] || []);
    }
  }, [open, actionId, allPermissions]);

  const filteredPermissions = permissions
    .map((group: IGroupPermissions) => ({
      ...group,
      permissions: group.attributes.filter((permission: IPermission) =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((group) => group.permissions.length > 0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isAllSelected = (group: IGroupPermissions) => {
    const filteredPermissionIds = group.attributes.map(
      (permission: IPermission) => permission.id,
    );
    return filteredPermissionIds.every((id) =>
      (selectedPermissions[actionId] || []).includes(id),
    );
  };

  const handleSelectAll = (group: IGroupPermissions, isChecked: boolean) => {
    const selectedPermissionsOfAction = selectedPermissions[actionId] || [];

    if (isChecked) {
      const allowedPermissionsForSelectAll = group.attributes
        .filter((permission: IPermission) => {
          // check if parent actions same permission is checked
          const parentActionId = permission.actionsMapping?.parentAction;
          if (!parentActionId) return true;
          return selectedPermissions[parentActionId]?.includes(permission.id);
        })
        .map((permission: IPermission) => permission.id);

      setSelectedPermissions(actionId, [
        ...selectedPermissionsOfAction,
        ...allowedPermissionsForSelectAll,
      ]);
    } else {
      const allowedPermissionsForDeselectAll = group.attributes
        .filter((permission: IPermission) => {
          if (permission.mandatory) return false;
          // check if children actions same permission is checked
          const childrenActionId = permission.actionsMapping?.childrenActions;
          if (!childrenActionId?.length) return true;
          const isSomeChildrenActionsPermissionChecked = childrenActionId.some(
            (childActionId) => {
              return selectedPermissions[childActionId]?.includes(
                permission.id,
              );
            },
          );
          return !isSomeChildrenActionsPermissionChecked;
        })
        .map((permission: IPermission) => permission.id);

      const filteredPermissions = selectedPermissionsOfAction.filter(
        (permissionId) =>
          !allowedPermissionsForDeselectAll.includes(permissionId),
      );
      setSelectedPermissions(actionId, filteredPermissions);
    }
  };

  return (
    <Flex gap='0.5rem' vertical style={{ marginLeft: '0.5rem' }}>
      <PermissionSearchInput
        searchTerm={searchTerm}
        clearSearch={clearSearch}
        handleSearch={handleSearch}
      />

      {filteredPermissions.length === 0 ? (
        <Flex>No data available</Flex>
      ) : (
        filteredPermissions.map((group, index: number) => {
          return (
            <Flex key={index} vertical gap='1rem'>
              <PermissionGroupName groupName={group.type} actionId={actionId} />
              <PermissionsCheckboxContainer
                actionId={actionId}
                permissions={group.permissions}
                searchTerm={searchTerm}
                isAllSelected={isAllSelected(group as IGroupPermissions)}
                onSelectAll={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleSelectAll(
                    group as IGroupPermissions,
                    event.target.checked,
                  );
                }}
              />
            </Flex>
          );
        })
      )}
    </Flex>
  );
};
