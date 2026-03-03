import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchReportCountsData } from '../services';
import { IFilterDataPayload, IExecutiveFilterDataPayload } from '../lib/utils';

export function useReportCountQuery(
  filters: IFilterDataPayload | IExecutiveFilterDataPayload,
  type: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.dashboard.counts(type, filters as Record<string, any>),
    queryFn: () => fetchReportCountsData(filters, type),
    enabled: !!type && Object.keys(filters).length > 0 && enabled,
  });
}
