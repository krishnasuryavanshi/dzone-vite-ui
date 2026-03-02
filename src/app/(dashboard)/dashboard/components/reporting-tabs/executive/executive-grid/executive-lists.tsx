'use client';
import { FC } from 'react';
import { IExcecutiveGrids } from '../types';
import { createColumn, Filters } from '@/lib/utils/table';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { TableProps } from 'antd';
import { IStatus } from '@/app/(dashboard)/campaign-management/lib/types';
import { ExecutiveGridActions } from './executive-actions';
import { useCampaignFilterOptions } from '@/app/(dashboard)/campaign-management/campaigns/lib/hooks';
import { CampaignStatus } from '@/app/(dashboard)/campaign-management/components';
import { useRouter } from 'next/navigation';

interface IExecutiveListsProps {
  lists: IExcecutiveGrids[];
  filterInfo: Filters<IExcecutiveGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}

const StaticContentHeight = 200;

export const ExecutiveLists: FC<IExecutiveListsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const router = useRouter();
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const getCampaignHref = (record: IExcecutiveGrids) =>
    `/campaign-management/campaigns/${record.campaignUUID}`;

  const handleRowClick = (record: IExcecutiveGrids) => {
    router.push(getCampaignHref(record));
  };
  const statusRenderer = (status: IStatus) => {
    return <CampaignStatus status={status} />;
  };
  const actionsRenderer = (_val: any, record: any) => (
    <ExecutiveGridActions executive={record} />
  );

  const options = useCampaignFilterOptions(hasFilters);
  const column = createColumn(true, filterInfo);
  const columns: TableProps<IExcecutiveGrids>['columns'] = [
    column('pages.executive.campaignName', 'campaignName', {
      width: 300,
      ellipsis: true,
    }),
    column('pages.executive.ioNumber', 'ioNumber', {
      width: 300,
      ellipsis: true,
    }),
    column(
      'pages.executive.status',
      'status',
      {
        isFilterable: true,
        width: 250,
      },
      statusRenderer,
      options,
    ),
    column('pages.executive.leadsGoal', 'leadsGoal'),
    column('pages.executive.leadsDelivered', 'leadsDelivered'),
    column('pages.executive.bookedRevenue', 'bookedRevenue'),
    column('pages.executive.invoiced', 'invoiced'),
    column('pages.executive.valueAddLeads', 'valueAddLeads'),
    column(
      'pages.executive.actions',
      'actions',
      { fixed: 'right', width: 100 },
      actionsRenderer,
    ),
  ];

  const handleChange = (data: any) => {
    onFiltersChange && onFiltersChange(data.filters);
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      style={{ marginTop: '1rem' }}
      columns={columns}
      data={lists}
      hasPagination={false}
      handleChange={handleChange}
      scrollableHeight={scrollableTableHeight}
      onClick={handleRowClick}
      rowHref={getCampaignHref}
    />
  );
};
