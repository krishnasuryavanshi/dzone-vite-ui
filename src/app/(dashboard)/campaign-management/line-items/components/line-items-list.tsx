import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { Filters } from '@/lib/utils/table';
import { useRouter } from '@/lib/hooks/use-router';
import { FC } from 'react';
import { useLineItemFilterOptions } from '../lib/hooks';
import { ILineItem } from '../lib/types';
import BasicDetails from '../lib/schemas/basic-details.json';
import { useListColumns } from '../../lib/hooks';

interface ILineItemsListProps {
  list: ILineItem[];
  hasFilters?: boolean;
  filterInfo?: Filters<ILineItem>;
  assignedTo?: string;
  handleFiltersChange?: (filters: Filters<ILineItem>) => void;
}

const StaticContentHeight = 216;

export const LineItemsList: FC<ILineItemsListProps> = ({
  list,
  hasFilters,
  filterInfo,
  assignedTo = 'all',
  handleFiltersChange,
}) => {
  const router = useRouter();
  const options = useLineItemFilterOptions(hasFilters, assignedTo);

  const columns = useListColumns<ILineItem>(
    BasicDetails as any[],
    hasFilters,
    filterInfo,
    options,
  );
  const { scrollableTableHeight } =
    useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: ILineItem) => {
    const showLineItemsLink = `/campaign-management/line-items/${record.id}`;
    router.push(showLineItemsLink);
  };

  const handleChange = ({ filters }: { filters: Filters<ILineItem> }) => {
    // Handle filter changes
    if (handleFiltersChange && filters) {
      handleFiltersChange(filters);
    }
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={list}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record) => handleRowClick(record)}
      rowHref={(record) => `/campaign-management/line-items/${record.id}`}
      handleChange={handleChange}
    />
  );
};
