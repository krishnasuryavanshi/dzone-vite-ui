import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchMarketerMasterFilterList } from '../../supplier/services/fetch-marketer-master-filter';

export function useMarketerMasterFilterQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.marketerFilters(),
    queryFn: async () => {
      const result = await fetchMarketerMasterFilterList();
      if (!result) throw new Error('Failed to fetch marketer master filters');
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
}
