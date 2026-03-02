'use client';
import { FC } from 'react';
import { createColumn, Filters } from '@/lib/utils/table';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { IRiskToLaunchGrids } from './types/risktolaunch-grid';
import { TableProps } from '@/lib/types/uicomponents';

interface IRiskToLaunchListsProps {
  lists: IRiskToLaunchGrids[];
  filterInfo: Filters<IRiskToLaunchGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}

const StaticContentHeight = 200;

export const RiskToLaunchList: FC<IRiskToLaunchListsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const column = createColumn(true, filterInfo);
  const columns: TableProps<IRiskToLaunchGrids>['columns'] = [
    column('pages.riskToLaunch.campaignName', 'campaign_name', {
      width: 300,
      ellipsis: true,
    }),
    column('pages.riskToLaunch.lineItem', 'line_item_name'),
    column('pages.riskToLaunch.supplier', 'supplier_name'),
    column('pages.riskToLaunch.targetStartDate', 'target_start_date'),
    column('pages.riskToLaunch.actualStartDate', 'actual_start_date'),
    column('pages.riskToLaunch.daysOverdue', 'days_overdue'),
    column('pages.riskToLaunch.atRiskReason', 'at_risk_reason_to_launch'),
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
