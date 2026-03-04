import { useMemo } from 'react';
import { useDashboardReportStore } from '../../store/use-dashboard-report-store';
import { useReportChartQuery } from '../../hooks/use-report-chart-query';
import { useReportCountQuery } from '../../hooks/use-report-count-query';
import { ExecutiveReportType } from '../enums';

function createFilteredData(filters: any, type: string) {
  switch (type) {
    case ExecutiveReportType.Bookings:
    case ExecutiveReportType.WaitingToGoLive:
      return {
        unit: filters.unit || '',
        timeframe: filters.timeframe || '',
      };
    default:
      return {
        campaigns: filters.campaigns,
        range: {
          startDate: filters.range.startDate,
          endDate: filters.range.endDate,
        },
      };
  }
}

export function useFetchReportData<T>(
  initialValue: T | T[],
  type: string,
  category: 'chart' | 'count' = 'chart',
): [T | T[], boolean] {
  const { filters } = useDashboardReportStore();

  const hasFilters = !!filters && Object.keys(filters).length > 0;

  const filteredData = useMemo(
    () => (hasFilters ? createFilteredData(filters, type) : {}),
    [filters, type, hasFilters],
  );

  const chartQuery = useReportChartQuery(filteredData, type, category === 'chart' && hasFilters);

  const countQuery = useReportCountQuery(filteredData, type, category === 'count' && hasFilters);

  const query = category === 'chart' ? chartQuery : countQuery;
  const data = query.data ?? initialValue;
  const isLoaded = !query.isLoading && hasFilters;

  return [data as T | T[], isLoaded];
}
