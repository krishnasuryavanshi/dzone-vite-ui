import { Translate } from '@/components/i18n';
import { usePermissionCheck } from '@/lib/hooks';
import { UserActionsEnum } from '@/lib/enums/permissions';
import { MenuProps } from '@/lib/types/uicomponents';
import { MoreOutlined } from '@/uicomponents/icons';
import { Button, Dropdown } from '@/uicomponents';
import Link from 'next/link';
import { FC } from 'react';
import { IOrganization } from '../lib/types';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface IOrganizationActionsProps {
  record: IOrganization;
  toggleStatus: (user: IOrganization) => void;
}

export const OrganizationActions: FC<IOrganizationActionsProps> = ({
  record,
  toggleStatus,
}) => {
  const status = record.status?.name;
  const statusLabel =
    status === 'INACTIVE' ? 'Activate Organization' : 'Deactivate Organization';
  const canViewUsers = usePermissionCheck(UserActionsEnum.View);

  const getDropdownMenus = () => {
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <Link
            href='#'
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(record);
            }}>
            <Translate i18nKey={statusLabel} />
          </Link>
        ),
      },
      canViewUsers && {
        key: '2',
        label: (
          <Link
            href={`/ums/users?org=${record.id}&orgName=${encodeURIComponent(record.name)}`}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <Translate i18nKey='View Users' />
          </Link>
        ),
      },
      {
        key: '3',
        label: (
          <Link
            href={`/organizations/${record.id}`}
            onClick={(e) => {
              e.stopPropagation();
            }}>
            <Translate i18nKey='Edit Details' />
          </Link>
        ),
      },
    ].filter(Boolean) as MenuProps['items'];
    return items;
  };

  return (
    <Dropdown menu={{ items: getDropdownMenus() }} placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
