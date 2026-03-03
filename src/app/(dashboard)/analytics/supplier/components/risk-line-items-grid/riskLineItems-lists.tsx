import { FC } from 'react';
import { createColumn, Filters } from '@/lib/utils/table';
import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { IRiskLineItemsGrids } from './types/risk-line-items-grid';
import { TableProps } from '@/lib/types/uicomponents';

interface IRiskLineItemListsProps {
  lists: IRiskLineItemsGrids[];
  filterInfo: Filters<IRiskLineItemsGrids>;
  onFiltersChange?: (filters: Record<string, any>) => void;
  hasFilters?: boolean;
}

const StaticContentHeight = 200;

export const RiskLineItemList: FC<IRiskLineItemListsProps> = ({
  lists,
  filterInfo,
  onFiltersChange,
  hasFilters,
}) => {
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const column = createColumn(true, filterInfo);
  const columns: TableProps<IRiskLineItemsGrids>['columns'] = [
    column('pages.riskLineItems.lineItem', 'lineItem', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.marketer', 'marketer', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.targetGoal', 'targetGoal', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.leadsPublished', 'leadsPublished', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.leadsRemaining', 'leadsRemaining', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.endDate', 'endDate', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.daysLeft', 'daysLeft', {
      width: 100,
      ellipsis: true,
    }),
    column('pages.riskLineItems.atRiskReason', 'atRiskReason', {
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
