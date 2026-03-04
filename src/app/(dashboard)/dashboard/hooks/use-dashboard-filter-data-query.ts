import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFilterData } from '../services/fetch-filter-data';

export function useDashboardFilterDataQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.filterData(),
    queryFn: () => fetchFilterData(),
    enabled,
  });
}
