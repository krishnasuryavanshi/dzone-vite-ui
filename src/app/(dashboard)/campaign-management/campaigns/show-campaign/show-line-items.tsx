import { LineItemsList } from '@/app/(dashboard)/campaign-management/line-items/components/line-items-list';
import { fetchLineItems } from '@/app/(dashboard)/campaign-management/line-items/services';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { ILineItem } from '../../line-items/lib/types';
import { LineItemHeader } from './line-item-header';
import { useLineItemContextStore } from '../../line-items/store/use-line-item-context-store';
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
  const updateList = useLineItemContextStore((s) => s.updateList);
  const [campaignLineItems, setCampaignLineItems] = useState<ILineItem[]>([]);
  const [showCreateLineItem, setShowCreateLineItem] = useState<boolean>(false);
  const [refreshId, setRefreshId] = useState<string>('');
  const { queryState } = useQueryState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterInfo, setFilterInfo] = useState<Filters<ILineItem>>({});

  const handelCreateLineItemForm = (isOpen: boolean) => {
    setShowCreateLineItem(isOpen);
  };

  useEffect(() => {
    fetchCampaignLineItems(currentPage, pageSize);
  }, [campaignUuId, showCreateLineItem, refreshId, currentPage, pageSize]);

  useEffect(() => {
    if (queryState) {
      let { refresh_id } = queryState;

      if (refresh_id) {
        setRefreshId(refresh_id);
      }
    }
  }, [queryState]);

  useEffect(() => {
    if (updateList) {
      setCampaignLineItems((prevList) => {
        const { id, status } = updateList;
        const updatedList = prevList.map((lineItem) =>
          lineItem?.id === id ? { ...lineItem, status } : lineItem,
        );
        if (!prevList.some((lineItem) => lineItem?.id === id)) {
          updatedList.push(updateList);
        }
        return updatedList;
      });
    }
  }, [updateList]);

  const fetchCampaignLineItems = async (
    page: number = 1,
    size: number = 25,
  ) => {
    const data = await fetchLineItems(page - 1, size, campaignUuId, filterInfo);
    if (data) {
      setCampaignLineItems(data.data || []);
      setTotalRecords(data.total || 0);
    }
  };

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
