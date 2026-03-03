import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchReportChartsData } from '../services';
import { IFilterDataPayload, IExecutiveFilterDataPayload } from '../lib/utils';

export function useReportChartQuery(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(type, filters as Record<string, any>),
    queryFn: () => fetchReportChartsData(filters, type),
    enabled: !!type && Object.keys(filters).length > 0 && enabled,
  });
}
