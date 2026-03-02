import { Translate } from '@/components/i18n';
import { Hideable } from '@/components/shared';
import { Checkbox } from '@/uicomponents/form/input';
import { Tag } from '@/uicomponents';
import React, { FC, useEffect, useState } from 'react';
import { IPermission } from '../../../lib/types';
import {
  useDependanciesStore,
  useEditStore,
  useSelectedPermissionsStore,
} from '../../../stores';
import './permission-checkbox-container.scss';
import { showNotification } from '@/services/notification';

interface IPermissionCheckboxProps {
  actionId: string;
  permission: IPermission;
}

export const PermissionCheckbox: FC<IPermissionCheckboxProps> = ({
  actionId,
  permission,
}) => {
  const { selectedPermissions, setSelectedPermissions } =
    useSelectedPermissionsStore();
  const { dependantPermissions } = useDependanciesStore();
  const { isEditAllowed, isEditing } = useEditStore();
  const [isParentPermissionNotChecked, setIsParentPermissionNotChecked] =
    useState(true);
  const [
    isParentActionPermissionNotChecked,
    setIsParentActionPermissionNotChecked,
  ] = useState(false);

  useEffect(() => {
    checkIfParentPermissionChecked();
    checkIfParentActionPermissionChecked();
  }, [dependantPermissions, selectedPermissions]);

  const checkIfParentPermissionChecked = () => {
    const parentPermissionId = permission.parent;
    if (parentPermissionId) {
      const hasParentPermissionChecked =
        selectedPermissions[actionId]?.includes(parentPermissionId);
      setIsParentPermissionNotChecked(!hasParentPermissionChecked);
    } else {
      setIsParentPermissionNotChecked(false);
    }
  };

  const checkIfParentActionPermissionChecked = () => {
    const parentActionId = permission.actionsMapping?.parentAction; // parent of current action
    if (parentActionId) {
      if (selectedPermissions[parentActionId]?.includes(permission.id)) {
        setIsParentActionPermissionNotChecked(false);
      } else {
        setIsParentActionPermissionNotChecked(true);
      }
    } else {
      setIsParentActionPermissionNotChecked(false);
    }
  };

  const handleCheckboxToggle = (
    event: React.ChangeEvent<HTMLInputElement>,
    permissionId: string,
  ) => {
    // check if the same permission in parent action is checked
    if (!event.target.checked) {
      const childrenActions = permission.actionsMapping?.childrenActions;
      if (childrenActions?.length) {
        const isSomeChildrenChecked = childrenActions.some((childActionId) =>
          selectedPermissions[childActionId]?.includes(permissionId),
        );
        if (isSomeChildrenChecked) {
          showNotification({
            type: 'error',
            message: `${permission.label} is already checked in other actions`,
          });
          return false;
        }
      }
    }

    const checkedPermissions = selectedPermissions[actionId] || [];
    if (event.target.checked) {
      checkedPermissions.push(permissionId);
      setSelectedPermissions(actionId, checkedPermissions);
    } else {
      const allDependantPermissions = dependantPermissions[permissionId] || [];
      const removingPermissions = [permissionId, ...allDependantPermissions];
      setSelectedPermissions(
        actionId,
        checkedPermissions.filter((id) => !removingPermissions.includes(id)),
      );
    }
  };

  return (
    <Checkbox
      checked={(selectedPermissions[actionId] || []).includes(permission.id)}
      disabled={
        permission.mandatory || // Disable checkbox if the permission is mandatory
        (!isEditAllowed && isEditing) || // Disable checkbox if not allowed to edit or view mode
        isParentPermissionNotChecked || // Disable checkbox if parent permission exists but not checked
        isParentActionPermissionNotChecked // Disable checkbox if parent action permission exists but not checked
      }
      className='dz-permission-checkbox'
      onChange={(event) => handleCheckboxToggle(event, permission.id)}>
      <Translate i18nKey={permission.label} />
      <Hideable show={!!permission.internal}>
        <Tag color='green' bordered={false} style={{ marginLeft: '0.5rem' }}>
          Internal
        </Tag>
      </Hideable>
    </Checkbox>
  );
};
