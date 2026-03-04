import { Filters } from '@/lib/utils/table';
import { useState } from 'react';
import { IExcecutiveGrids } from '../types';
import { ExecutiveLists } from './executive-lists';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { useExecutiveGridQuery } from '@/app/(dashboard)/dashboard/hooks';

export const ExecutiveGrids = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filteredInfo, setFilteredInfo] = useState<any>({});

  const { data } = useExecutiveGridQuery(
    currentPage,
    pageSize,
    filteredInfo?.status ? filteredInfo.status : [],
  );

  const executiveList = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const handleFiltersChange = (filters: Filters<IExcecutiveGrids>) => {
    setFilteredInfo(filters);
    goToFirstPage();
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  return (
    <TableWithPaginationLayout
      table={
        <ExecutiveLists
          lists={executiveList}
          filterInfo={filteredInfo}
          onFiltersChange={handleFiltersChange}
          hasFilters
        />
      }
      pagination={
        <Hideable show={totalRecords > 0}>
          <SimplePagination
            total={totalRecords}
            onChange={handlePaginationChange}
            current={currentPage}
            pageSize={pageSize}
          />
        </Hideable>
      }
    />
  );
};
