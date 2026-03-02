import { Translate } from '@/components/i18n';
import { Checkbox } from '@/uicomponents/form/input';
import { Space } from '@/uicomponents/layout';
import { FC } from 'react';
import { IPermission } from '../../../lib/types';
import { useEditStore } from '../../../stores';
import { PermissionCheckbox } from './permission-checkbox';
import './permission-checkbox-container.scss';

interface IPermissionsCheckboxContainerProps {
  actionId: string;
  permissions: IPermission[];
  searchTerm: string;
  isAllSelected: boolean;
  onSelectAll: (isChecked: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PermissionsCheckboxContainer: FC<
  IPermissionsCheckboxContainerProps
> = ({ permissions, searchTerm, isAllSelected, onSelectAll, actionId }) => {
  const { isEditAllowed, isEditing } = useEditStore();

  const hasMultiplePermissions = permissions.length > 1;

  return (
    <>
      {!searchTerm && hasMultiplePermissions && (
        <Checkbox
          className='dz-permission-checkbox'
          checked={isAllSelected}
          onChange={onSelectAll}
          disabled={!isEditAllowed && isEditing}>
          <Space style={{ fontWeight: 700 }}>
            <Translate i18nKey='Select All' />
          </Space>
        </Checkbox>
      )}
      {permissions.map((permission: IPermission) => {
        return (
          <PermissionCheckbox
            key={permission.id}
            actionId={actionId}
            permission={permission}
          />
        );
      })}
    </>
  );
};
