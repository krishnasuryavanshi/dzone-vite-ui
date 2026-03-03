import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFilterData } from '../services';

export function useDashboardFilterOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.filters(),
    queryFn: fetchFilterData,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
