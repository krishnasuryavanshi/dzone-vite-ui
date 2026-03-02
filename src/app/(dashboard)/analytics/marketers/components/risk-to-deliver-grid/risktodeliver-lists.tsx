'use client';
import { FC } from 'react';
import { createColumn, Filters } from '@/lib/utils/table';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { TableProps } from 'antd/lib/table';
import { IRiskToDeliverGrids } from './types/risktodeliver-grid';

interface IRiskToDeliverListsProps {
  lists: IRiskToDeliverGrids[];
  filterInfo: Filters<IRiskToDeliverGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}

const StaticContentHeight = 200;

export const RiskToDeliverList: FC<IRiskToDeliverListsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const column = createColumn(true, filterInfo);
  const columns: TableProps<IRiskToDeliverGrids>['columns'] = [
    column('Campaign Name', 'campaign_name', {
      width: 300,
      ellipsis: true,
    }),
    column('Line item name', 'line_item_name'),
    column('Supplier Name', 'supplier_name', {
      width: 140,
      ellipsis: true,
    }),
    column('Target Start Date', 'target_start_date', {
      width: 160,
      ellipsis: true,
    }),
    column('Actual Start Date', 'actual_start_date', {
      width: 160,
      ellipsis: true,
    }),
    column('Target Lead Goal', 'target_lead_goal', {
      width: 140,
      ellipsis: true,
    }),
    column('Leads Delivered', 'leads_delivered', {
      width: 150,
      ellipsis: true,
    }),
    column('Pacing Gap', 'pacingGap', {
      width: 120,
      ellipsis: true,
    }),
    column('Days Overdue', 'days_overdue', {
      width: 100,
      ellipsis: true,
    }),
    column('Return Reason', 'return_reason'),
    column('Actions', 'actions', {
      width: 100,
      ellipsis: true,
    }),
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
    />
  );
};
