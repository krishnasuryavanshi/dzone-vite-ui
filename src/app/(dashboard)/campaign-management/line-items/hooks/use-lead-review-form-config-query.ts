import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadReviewFormConfig } from '../services';

export function useLeadReviewFormConfigQuery(type: string, lineItemId?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.leads.reviewFormConfig(type, lineItemId),
    queryFn: async () => {
      const result = await fetchLeadReviewFormConfig(type, lineItemId);
      if (!result || result.isError) throw new Error('Failed to fetch lead review form config');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!type && enabled,
  });
}
