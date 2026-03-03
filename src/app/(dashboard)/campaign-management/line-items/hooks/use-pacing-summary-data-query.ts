import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPacingSummaryData } from '../services';

export function usePacingSummaryDataQuery(
  lineItemId: string,
  params?: Record<string, any>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.pacing.data(lineItemId, params),
    queryFn: async () => {
      const result = await fetchPacingSummaryData(lineItemId, params);
      if (!result) throw new Error('Failed to fetch pacing summary data');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled: !!lineItemId && enabled,
  });
}
