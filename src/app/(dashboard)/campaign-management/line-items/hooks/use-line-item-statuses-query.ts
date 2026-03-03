import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchStatusPicklist } from '../services';

export function useLineItemStatusesQuery() {
  return useQuery({
    queryKey: queryKeys.lineItems.statuses(),
    queryFn: async () => {
      const result = await fetchStatusPicklist();
      if (!result) throw new Error('Failed to fetch line item statuses');
      return result;
    },
    staleTime: 30 * 60 * 1000, // 30 min — statuses rarely change
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}
