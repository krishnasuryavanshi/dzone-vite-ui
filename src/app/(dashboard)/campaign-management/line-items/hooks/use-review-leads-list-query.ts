import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchReviewLeadsList } from '../services';

export function useReviewLeadsListQuery(
  lineItemId: string,
  filters?: Record<string, any>[],
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.leads.reviewList(lineItemId, filters),
    queryFn: async () => {
      const result = await fetchReviewLeadsList(lineItemId, filters);
      if (!result) throw new Error('Failed to fetch review leads list');
      return result;
    },
    enabled: !!lineItemId && enabled,
  });
}
