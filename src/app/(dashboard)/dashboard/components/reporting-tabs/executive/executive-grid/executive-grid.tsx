import { Filters } from '@/lib/utils/table';
import { useEffect, useState } from 'react';
import { IExcecutiveGrids } from '../types';
import { fetchExecutiveGrid } from '@/app/(dashboard)/dashboard/services';
import { ExecutiveLists } from './executive-lists';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';

export const ExecutiveGrids = () => {
  const [executiveList, setExecutiveList] = useState<IExcecutiveGrids[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState<any>({});

  const fetchFilterData = async (
    page: number,
    size: number,
    filteredInfo: any,
  ) => {
    const data = await fetchExecutiveGrid(
      page,
      size,
      filteredInfo?.status ? filteredInfo.status : [],
    );
    if (data) {
      setTotalRecords(data?.total);
      setExecutiveList(data.data);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchFilterData(currentPage, pageSize, filteredInfo);
  }, [currentPage, pageSize, filteredInfo]);

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
