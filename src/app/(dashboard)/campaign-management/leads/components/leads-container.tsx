
import { Hideable, TableWithPaginationLayout } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';
import { FC, useMemo, useState } from 'react';
import { ILead } from '../lib/types';
import { LeadsFiltersManager } from './leads-filters-manager';
import { LeadsList } from './leads-list';
import { Filters } from '@/lib/utils/table';
import { isEmpty } from 'lodash';
import { useSearchParams } from '@/lib/hooks/use-router';
import { useLeadsListQuery } from '../hooks/use-leads-list-query';

interface IleadsContainerProps {
  batchId?: string;
}

export const LeadsContainer: FC<IleadsContainerProps> = ({ batchId }) => {
  const searchParams = useSearchParams();
  const lineItemId = searchParams.get('lineItemId');
  const tenantCode = searchParams.get('tenantCode') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filteredInfo, setFilteredInfo] = useState<Filters<ILead>>({});
  const [disableExportButton, setDisableExportButton] =
    useState<boolean>(false);
  const [isSearchDisabled] = useState<boolean>(true);
  const [isFilterDisabled] = useState<boolean>(true);
  const [isRefreshDisabled] = useState<boolean>(true);

  const extraParams = useMemo(() => {
    const nonEmptyKeys = Object.keys(filteredInfo)
      .filter(
        (key) => filteredInfo[key] !== null && filteredInfo[key] !== undefined,
      )
      .reduce(
        (acc, key) => {
          if (key === 'sortBy' || key === 'sortOrder') {
            const value = filteredInfo[key];
            acc[key] = Array.isArray(value) ? value[0] : value;
          } else {
            const value = filteredInfo[key];
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
    return nonEmptyKeys;
  }, [filteredInfo]);

  const { data } = useLeadsListQuery(
    currentPage - 1,
    pageSize,
    tenantCode,
    lineItemId,
    extraParams,
    !!lineItemId,
  );

  const leadsList = data?.data ?? [];
  const totalRecords = data?.total ?? 0;

  // Update export button state based on data
  useMemo(() => {
    setDisableExportButton(leadsList.length === 0);
  }, [leadsList.length]);

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
