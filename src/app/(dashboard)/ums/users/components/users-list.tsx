import { BasicTable } from '@/components/table';
import { FormatDate } from '@/components/util';
import { useScrollableTableHeight } from '@/lib/hooks';
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn, Filters } from '@/lib/utils/table';
import { useRouter } from '@/lib/hooks/use-router';
import { FC } from 'react';
import { IUser } from '../lib/types';
import { Roles } from './roles';
import { UserName } from './user-name';
import { UsersActions } from './users-actions';
import { UsersStatus } from './users-status';

const StaticContentHeight = 216;

interface IUsersListProps {
  users: IUser[];
  toggleStatus: (user: IUser) => void;
  resendSetPasswordLink: (user: IUser) => void;
  onFiltersChange?: (filters: Record<string, any>) => void;
  filterInfo?: Filters<IUser>;
  emptyText?: React.ReactNode;
}

export const UsersList: FC<IUsersListProps> = ({
  users,
  toggleStatus,
  resendSetPasswordLink,
  onFiltersChange,
  filterInfo,
  emptyText,
}) => {
  const router = useRouter();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: IUser) => {
    if (record.status !== 'Invited') {
      router.push(`/ums/users/${record.id}`);
    }
  };

  const statusRenderer = (status: string) => {
    if (!status) {
      return null;
    }
    return <UsersStatus status={status} />;
  };

  const dateRenderer = (lastLoginTime: string) => {
    if (!lastLoginTime) {
      return null;
    }
    return <FormatDate date={lastLoginTime} />;
  };

  const actionsRenderer = (_val: any, record: any, index: number) => {
    return (
      <UsersActions
        record={record}
        toggleStatus={toggleStatus}
        resendSetPasswordLink={resendSetPasswordLink}
      />
    );
  };

  const nameRenderer = (_val: any, record: any) => {
    return <UserName record={record} />;
  };

  const rolesRenderer = (_val: any, record: any) => {
    return <Roles record={record} />;
  };

  const column = createColumn(true, filterInfo);
  const columns: TableProps<IUser>['columns'] = [
    column(
      'Username',
      'username',
      {
        width: 300,
        isSearchable: true,
      },
      nameRenderer,
    ),
    column(
      'Roles',
      'users',
      {
        width: 300,
      },
      rolesRenderer,
    ),
    column('Tenant Type', 'type', {
      width: 300,
    }),
    column(
      'Last active on',
      'lastLoggedIn',
      {
        ellipsis: true,
        width: 150,
      },
      dateRenderer,
    ),
    column(
      'Status',
      'status',
      {
        ellipsis: true,
        width: 100,
      },
      statusRenderer,
    ),

    column(
      'pages.clients.label.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];

  const handleChange = (data: any) => {
    onFiltersChange?.(data.filters);
  };

  return (
    <BasicTable
      className='row-hover-highlight cell-height-max-content'
      columns={columns}
      data={users}
      hasPagination={false}
      handleChange={handleChange}
      scrollableHeight={scrollableTableHeight}
      onClick={(record: any) => handleRowClick(record)}
      rowHref={(record: IUser) =>
        record.status !== 'Invited' ? `/ums/users/${record.id}` : undefined
      }
      emptyText={emptyText}
    />
  );
};
