import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchReturnReasonsList } from '../../leads/services';

export function useReturnReasonsQuery() {
  return useQuery({
    queryKey: queryKeys.leads.returnReasons(),
    queryFn: async () => {
      const result = await fetchReturnReasonsList();
      if (!result) throw new Error('Failed to fetch return reasons');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
