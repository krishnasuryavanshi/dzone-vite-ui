import { UserStatus } from '@/app/(dashboard)/components';
import { BasicTable } from '@/components/table';
import { FormatDate } from '@/components/util';
import { useScrollableTableHeight } from '@/lib/hooks';
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn } from '@/lib/utils/table';
import { useRouter } from '@/lib/hooks/use-router';
import { FC } from 'react';
import { Status } from '../lib/enums';
import { IRoles, IStatus } from '../lib/types';
import { RoleActions } from './role-actions';

const StaticContentHeight = 216;

const StatusNames = { Active: 'ACTIVE', Inactive: 'INACTIVE' };

interface IRolesListProps {
  allRoles: IRoles[];
  updateRolesStatus: (id: string, status: string) => Promise<void>;
}

export const RolesList: FC<IRolesListProps> = ({
  allRoles,
  updateRolesStatus,
}) => {
  const router = useRouter();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: IRoles) => {
    if (record?.editable) {
      router.push(`/ums/roles/${record.id}`);
    }
  };

  const handleChangeStatus = async (record: IRoles) => {
    updateRolesStatus(
      record?.id,
      record?.status?.name === Status.ACTIVE ? Status.INACTIVE : Status.ACTIVE,
    );
  };

  const statusRenderer = (status: IStatus) => {
    if (!status?.value) {
      return null;
    }
    return <UserStatus name={status?.name} value={status.value} noIcon />;
  };

  const dateRenderer = (updatedAt: string) => {
    if (!updatedAt) {
      return null;
    }
    return <FormatDate date={updatedAt} />;
  };

  const actionsRenderer = (_val: any, record: any) => {
    return (
      <RoleActions
        record={record}
        handleClick={() => handleChangeStatus(record)}
        handleShowUsers={() => router.push(`/ums/users?roleId=${record.id}`)}
      />
    );
  };

  const column = createColumn();
  const columns: TableProps<IRoles>['columns'] = [
    column('pages.rolesAndPermissions.label.roleName', 'name', {
      ellipsis: true,
    }),
    column('pages.rolesAndPermissions.label.numberOfUsers', 'users', {
      ellipsis: true,
      width: 100,
    }),
    column(
      'pages.rolesAndPermissions.label.status',
      'status',
      {
        ellipsis: true,
        width: 100,
      },
      statusRenderer,
    ),
    column('pages.rolesAndPermissions.label.type', 'tenantType', {
      ellipsis: true,
      width: 100,
    }),
    column(
      'pages.rolesAndPermissions.label.lastUpdated',
      'updatedAt',
      {
        ellipsis: true,
        width: 100,
      },
      dateRenderer,
    ),
    column(
      'pages.clients.label.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];
  const handleChange = () => {};
  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={allRoles}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record: any) => handleRowClick(record)}
      rowHref={(record: IRoles) =>
        record?.editable ? `/ums/roles/${record.id}` : undefined
      }
      handleChange={handleChange}
    />
  );
};
