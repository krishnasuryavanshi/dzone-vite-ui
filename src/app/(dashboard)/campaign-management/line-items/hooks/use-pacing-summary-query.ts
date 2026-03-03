import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPacingSummary } from '../services';

export function usePacingSummaryQuery(lineItemId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.pacing.summary(lineItemId),
    queryFn: async () => {
      const result = await fetchPacingSummary(lineItemId);
      if (!result) throw new Error('Failed to fetch pacing summary');
      return result;
    },
    enabled: !!lineItemId && enabled,
  });
}
