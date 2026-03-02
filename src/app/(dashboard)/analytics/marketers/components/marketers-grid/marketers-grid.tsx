'use client';
import { Filters } from '@/lib/utils/table';
import { useEffect, useState } from 'react';
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { IMarketersGrids } from '../../types/marketers-grids';
import { MarketersLists } from './marketers-list';
import { SimplePagination } from '@/uicomponents/simple-pagination';

type marketerGridProps = {
  data: any;
};

export const MarketersGrids = ({ data }: marketerGridProps) => {
  const [marketerList, setMarketersList] = useState<IMarketersGrids[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const [tableData, setTableData] = useState([]);

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data) {
      const tableData = data?.map((item: any) => {
        return {
          ...item,
          target_lead_goal: item?.target_lead_goal?.toLocaleString(),
          leads_delivered: item?.leads_delivered?.toLocaleString(),
          pacing_gap: item?.pacing_gap?.toLocaleString(),
          supplier_names: item?.supplier_from_parent_flag ? (
            <span style={{ color: 'red' }}>{item?.supplier_names}</span>
          ) : (
            item?.supplier_names
          ),
          days_left_overdue: (() => {
            if (!item?.days_left_overdue && item?.days_left_overdue !== 0)
              return '-';
            const value = item.days_left_overdue.toString();
            const hasEndDate = value.includes('(end date)');
            return {
              text: hasEndDate ? value.replace('(end date)', '').trim() : value,
              style: { color: hasEndDate ? 'red' : 'inherit' },
            };
          })(),
        };
      });
      setTableData(tableData);
      setTotalRecords(data?.length);
      setMarketersList(tableData?.slice(0, 25));
    }
  }, [data]);

  const handleFiltersChange = (filters: Filters<IMarketersGrids>) => {
    setFilteredInfo(filters);
    goToFirstPage();
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (page > 1) {
      setMarketersList(
        tableData?.slice(pageSize * (page - 1), pageSize * page),
      );
    } else {
      setMarketersList(tableData?.slice(0, 25));
    }
  };
  return (
    <TableWithPaginationLayout
      table={
        <MarketersLists
          lists={marketerList}
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
