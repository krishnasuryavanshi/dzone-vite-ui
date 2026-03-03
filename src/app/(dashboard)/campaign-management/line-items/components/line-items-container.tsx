
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { ScreenLoader } from '@/components/shared/loader';
import { useQueryState } from '@/lib/hooks';
import { hasActiveFilters } from '@/lib/utils';
import { Filters } from '@/lib/utils/table';
import { SimplePagination } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { ILineItem } from '../lib/types';
import { useLineItemsQuery } from '../hooks';
import { LineItemsFiltersManager } from './line-items-filters-manager';
import { LineItemsList } from './line-items-list';
import { useSearchParams } from '@/lib/hooks/use-router';

interface ILineItemsContainerProps {}

export const LineItemsContainer: FC<ILineItemsContainerProps> = ({}) => {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || '';
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const { queryState, setQueryState } = useQueryState();
  const [filterInfo, setFilterInfo] = useState<Filters<ILineItem>>({});

  const [isSearchDisabled, setIsSearchDisabled] = useState<boolean>(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(false);
  const [assignedTo, setAssignedTo] = useState('all');

  const hasValidPagination = currentPage > 0 && pageSize > 0;

  const { data, isLoading } = useLineItemsQuery(
    currentPage - 1,
    pageSize,
    campaignId,
    filterInfo,
    hasValidPagination,
  );

  const lineItemsList = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  useEffect(() => {
    setIsDownloadDisabled(true);
    setIsRefreshDisabled(true);
    setIsSearchDisabled(true);
  }, []);

  useEffect(() => {
    if (queryState) {
      let { page, pageSize } = queryState;
      const pageNo = Number(page);
      const size = Number(pageSize);
      if (pageNo && size) {
        setCurrentPage(pageNo);
        setPageSize(size);
      } else {
        setQueryState([
          { name: 'page', value: pageNo || 1 },
          { name: 'pageSize', value: size || 25 }, //default page size 25 as discussed with Sougata
        ]);
      }
    }
  }, [queryState]);

  const handlePageChange = (page: number, pageSize?: number) => {
    const updates = [{ name: 'page', value: page }];
    if (pageSize !== undefined) {
      updates.push({ name: 'pageSize', value: pageSize });
    }
    setQueryState(updates);
  };

  const goToFirstPage = () => {
    setQueryState([{ name: 'page', value: 0 }]);
  };

  const clearFilters = () => {
    setAssignedTo('all');
    setFilterInfo({});
    if (Object.values(filterInfo).filter((value) => value).length) {
      goToFirstPage();
    }
  };

  const handleFiltersChange = (filters: Filters<ILineItem>) => {
    setFilterInfo(filters);
    goToFirstPage();
  };

  const handleAssignedToFilterChange = (assignedTo: string) => {
    setAssignedTo(assignedTo); // all or userId
    if (assignedTo === 'all') {
      handleFiltersChange({ ...filterInfo, assignedTo: null });
    } else {
      handleFiltersChange({
        ...filterInfo,
        assignedTo: [assignedTo],
      });
    }
  };

  if (isLoading && !data) return <ScreenLoader />;

  return (
    <TableWithPaginationLayout
      header={
        <LineItemsFiltersManager
          clearFilters={clearFilters}
          isDownloadDisabled={isDownloadDisabled}
          isRefreshDisabled={isRefreshDisabled}
          isSearchDisabled={isSearchDisabled}
          assignedToFilterSelectedValue={assignedTo}
          handleAssignedToFilterChange={handleAssignedToFilterChange}
          hasActiveFilters={hasActiveFilters(filterInfo)}
        />
      }
      table={
        <LineItemsList
          list={lineItemsList}
          filterInfo={filterInfo}
          handleFiltersChange={handleFiltersChange}
          assignedTo={assignedTo}
          hasFilters
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
