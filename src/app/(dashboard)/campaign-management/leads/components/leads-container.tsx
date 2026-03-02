'use client';

import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { ILead } from '../lib/types';
import { fetchLeadsList } from '../services';
import { LeadsFiltersManager } from './leads-filters-manager';
import { LeadsList } from './leads-list';
import { Filters } from '@/lib/utils/table';
import { isEmpty } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useLeadsStore } from '../../line-items/store';
interface IleadsContainerProps {
  batchId?: string;
}

export const LeadsContainer: FC<IleadsContainerProps> = ({ batchId }) => {
  const searchParams = useSearchParams();
  const lineItemId = searchParams.get('lineItemId');
  const tenantCode = searchParams.get('tenantCode') || '';
  const leadsList = useLeadsStore((state) => state.leadsList);
  const setLeadsList = useLeadsStore((state) => state.setLeadsList);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState<Filters<ILead>>({});
  const [disableExportButton, setDisableExportButton] =
    useState<boolean>(false);
  const [isSearchDisabled, setIsSearchDisabled] = useState<boolean>(false);
  const [isFilterDisabled, setIsFilterDisabled] = useState<boolean>(false);
  const [isRefreshDisabled, setIsRefreshDisabled] = useState<boolean>(false);

  useEffect(() => {
    setIsFilterDisabled(true);
    setIsRefreshDisabled(true);
    setIsSearchDisabled(true);
  }, []);

  useEffect(() => {
    const nonEmptyKeys = Object.keys(filteredInfo)
      .filter(
        (key) => filteredInfo[key] !== null && filteredInfo[key] !== undefined,
      )
      .reduce(
        (acc, key) => {
          // Handle sortBy and sortOrder arrays specially
          if (key === 'sortBy' || key === 'sortOrder') {
            const value = filteredInfo[key];
            acc[key] = Array.isArray(value) ? value[0] : value;
          } else {
            const value = filteredInfo[key];
            // Handle date range objects (from DateTimeRangeFilter or DateRangeObjectFilter)
            if (
              Array.isArray(value) &&
              value.length > 0 &&
              typeof value[0] === 'object' &&
              value[0] !== null &&
              ('from' in value[0] || 'to' in value[0])
            ) {
              const dateRange = value[0] as { from?: string; to?: string };
              if (dateRange.from) acc[`${key}From`] = dateRange.from;
              if (dateRange.to) acc[`${key}To`] = dateRange.to;
            } else {
              acc[key] = value?.toString();
            }
          }
          return acc;
        },
        {} as Record<string, any>,
      );
    fetchData(currentPage - 1, pageSize, nonEmptyKeys);
  }, [pageSize, currentPage, filteredInfo, lineItemId]);

  const fetchData = async (
    page: number,
    size: number,
    nonEmptyKeys: Record<string, any> = {},
  ) => {
    const data = await fetchLeadsList(
      page,
      size,
      tenantCode,
      lineItemId,
      nonEmptyKeys,
    );
    if (data) {
      setTotalRecords(data?.total);
      setLeadsList(data.data);
      setDisableExportButton(data?.data.length === 0);
    }
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleFiltersChange = (filters: Record<string, any> = {}) => {
    setFilteredInfo(filters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    if (!isEmpty(filteredInfo)) {
      handleFiltersChange({});
      setDisableExportButton(false);
    }
  };

  return (
    <TableWithPaginationLayout
      header={
        <LeadsFiltersManager
          filteredInfo={filteredInfo}
          handleClearFilters={handleClearFilters}
          disableExportButton={disableExportButton}
          isFilterDisabled={isFilterDisabled}
          isRefreshDisabled={isRefreshDisabled}
          isSearchDisabled={isSearchDisabled}
        />
      }
      table={
        <LeadsList
          list={leadsList}
          lineItemId={lineItemId}
          filterInfo={filteredInfo}
          onFiltersChange={handleFiltersChange}
          hasFilters
        />
      }
      pagination={
        <Hideable show={totalRecords > 0}>
          <SimplePagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={handlePaginationChange}
          />
        </Hideable>
      }
    />
  );
};
