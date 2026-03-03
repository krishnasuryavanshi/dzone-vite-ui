import React, { FC } from 'react';
import { IOrganization } from '../lib/types';
import { BasicTable } from '@/components/table';
import { TableProps } from '@/lib/types/uicomponents';
import { FormatDate } from '@/components/util';
import { UsersStatus } from '@/app/(dashboard)/ums/users/components/users-status';
import { useRouter } from '@/lib/hooks/use-router';
import { useScrollableTableHeight } from '@/lib/hooks';
import { OrganizationActions } from './organization-actions';
import { Filters, Sorter, createColumn } from '@/lib/utils/table';

const StaticContentHeight = 216;

interface IOrganizationListProps {
  organizations: IOrganization[];
  toggleStatus: (user: IOrganization) => void;
  filterInfo: Filters<IOrganization>;
  sorterInfo: Sorter<IOrganization>;
  handleFiltersChange: (filters: Filters<IOrganization>) => void;
  handleSorterChange: (sorter: Sorter<IOrganization>) => void;
}

export const OrganizationList: FC<IOrganizationListProps> = ({
  organizations,
  toggleStatus,
  filterInfo,
  sorterInfo,
  handleFiltersChange,
  handleSorterChange,
}) => {
  const router = useRouter();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: IOrganization) => {
    router.push(`/organizations/${record.id}`);
  };

  const statusRenderer = (status: { value: string }) => {
    if (!status) {
      return null;
    }
    return <UsersStatus status={status.value} />;
  };

  const dateRenderer = (lastLoginTime: string) => {
    if (!lastLoginTime) {
      return null;
    }
    return <FormatDate date={lastLoginTime} />;
  };

  const actionsRenderer = (_val: any, record: any, index: number) => {
    return <OrganizationActions record={record} toggleStatus={toggleStatus} />;
  };

  const column = createColumn<IOrganization>(true, filterInfo);
  // Handle sorter being either single or array
  const sorter = Array.isArray(sorterInfo) ? sorterInfo[0] : sorterInfo;

  const columns: TableProps<IOrganization>['columns'] = [
    column('Organization Name', 'name', {
      width: 300,
      ellipsis: true,
      isSearchable: true,
    }),
    column('Organization ID', 'code', {
      width: 200,
      isSearchable: true,
    }),
    column(
      'Started On',
      'createdAt',
      {
        ellipsis: true,
        width: 200,
        sorter: true,
        sortOrder: sorter?.field === 'createdAt' ? sorter.order : undefined,
        isDateRangeObjectFilter: true,
      },
      dateRenderer,
    ),
    column(
      'Status',
      'status',
      {
        ellipsis: true,
        width: 200,
      },
      statusRenderer,
    ),
    column('Type', 'organizationType.name', {
      width: 150,
    }),
    column('CRM ID', 'crmId', {
      width: 150,
    }),
    column('Finance ID', 'financeId', {
      width: 150,
    }),
    column(
      'pages.clients.label.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];

  const handleChange = ({
    filters,
    sorter,
  }: {
    filters: Filters<IOrganization>;
    sorter: Sorter<IOrganization>;
  }) => {
    handleFiltersChange(filters);
    handleSorterChange(sorter);
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={organizations}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record: any) => handleRowClick(record)}
      rowHref={(record) => `/organizations/${record.id}`}
      handleChange={handleChange}
    />
  );
};
