import { LineItemsList } from '@/app/(dashboard)/campaign-management/line-items/components/line-items-list';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { ILineItem } from '../../line-items/lib/types';
import { LineItemHeader } from './line-item-header';
import { useLineItemsQuery } from '../../line-items/hooks';
import { useQueryState } from '@/lib/hooks';
import { Filters } from '@/lib/utils/table';

interface IShowLineItemsProps {
  campaignId: string;
  campaignUuId: string;
  show: boolean;
}

export const ShowLineItems: FC<IShowLineItemsProps> = ({
  campaignId,
  campaignUuId,
  show,
}) => {
  const [showCreateLineItem, setShowCreateLineItem] = useState<boolean>(false);
  const [refreshId, setRefreshId] = useState<string>('');
  const { queryState } = useQueryState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filterInfo, setFilterInfo] = useState<Filters<ILineItem>>({});

  const { data } = useLineItemsQuery(
    currentPage - 1,
    pageSize,
    campaignUuId,
    filterInfo,
    show,
  );

  const campaignLineItems = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  const handelCreateLineItemForm = (isOpen: boolean) => {
    setShowCreateLineItem(isOpen);
  };

  useEffect(() => {
    if (queryState) {
      let { refresh_id } = queryState;

      if (refresh_id) {
        setRefreshId(refresh_id);
      }
    }
  }, [queryState]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize !== undefined) {
      setPageSize(pageSize);
    }
  };

  const handleFiltersChange = (filters: Filters<ILineItem>) => {
    setFilterInfo(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (!show) return null;

  return (
    <TableWithPaginationLayout
      header={
        <LineItemHeader
          showCreateLineItem={showCreateLineItem}
          handelCreateLineItemForm={handelCreateLineItemForm}
          totalLineItems={totalRecords || campaignLineItems?.length || 0}
          campaignId={campaignId}
          campaignUuId={campaignUuId}
        />
      }
      table={
        <LineItemsList
          list={campaignLineItems}
          hasFilters={false}
          handleFiltersChange={handleFiltersChange}
        />
      }
      pagination={
        <Hideable show={totalRecords > 0}>
          <SimplePagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePageChange}
          />
        </Hideable>
      }
    />
  );
};
