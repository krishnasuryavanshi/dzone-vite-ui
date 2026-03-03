import { Filters } from '@/lib/utils/table';
import { useEffect, useState } from 'react';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { SupplierLists } from './supplier-list'; // Update the path if SupplierList.tsx is in the parent directory
import { ISupplierGrids } from '../../types/supplier-grids';

type SupplierGridProps = {
  supplierDashboardData: any;
};

export const SupplierGrids = ({ supplierDashboardData }: SupplierGridProps) => {
  const [supplierList, setSupplierList] = useState<ISupplierGrids[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [tableData, setTableData] = useState([]);

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    if (supplierDashboardData) {
      const tableData = supplierDashboardData?.map((item: any) => {
        return {
          ...item,
          target_goal: item?.target_goal?.toLocaleString(),
          leads_published: item?.leads_published?.toLocaleString(),
          leads_remaining: item?.leads_remaining?.toLocaleString(),
        };
      });
      setTableData(tableData);
      setTotalRecords(supplierDashboardData?.length);
      setSupplierList(tableData?.slice(0, 25));
    }
  }, [supplierDashboardData]);

  const handleFiltersChange = (filters: Filters<ISupplierGrids>) => {
    setFilteredInfo(filters);
    goToFirstPage();
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (page > 1) {
      setSupplierList(tableData?.slice(pageSize * (page - 1), pageSize * page));
    } else {
      setSupplierList(tableData?.slice(0, 25));
    }
  };
  return (
    <TableWithPaginationLayout
      table={
        <SupplierLists
          lists={supplierList} // supplierList
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
