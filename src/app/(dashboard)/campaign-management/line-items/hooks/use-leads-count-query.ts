import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchTotalLeadsCount, fetchTotalFilteredLeadsCount } from '../services';
import { useMemo } from 'react';

export function useLeadsCountQuery(lineItemId: string, selectedLeadStatuses: string[]) {
  const hasFilters = selectedLeadStatuses.length > 0;

  const filters = useMemo(() => {
    if (!hasFilters) return [];
    return [{ key: 'leadStatus', value: selectedLeadStatuses }];
  }, [selectedLeadStatuses, hasFilters]);

  return useQuery({
    queryKey: hasFilters
      ? queryKeys.leads.totalFilteredCount(lineItemId, filters)
      : queryKeys.leads.totalCount(lineItemId),
    queryFn: async () => {
      if (hasFilters) {
        const data = await fetchTotalFilteredLeadsCount(lineItemId, filters);
        return data?.leadCount ?? 0;
      }
      const data = await fetchTotalLeadsCount(lineItemId);
      return data?.count ?? 0;
    },
    enabled: !!lineItemId,
  });
}
