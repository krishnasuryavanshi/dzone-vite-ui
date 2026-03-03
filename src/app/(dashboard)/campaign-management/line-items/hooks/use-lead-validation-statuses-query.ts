import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadValidationStatusList } from '../../leads/services';

export function useLeadValidationStatusesQuery() {
  return useQuery({
    queryKey: queryKeys.leads.validationStatuses(),
    queryFn: async () => {
      const result = await fetchLeadValidationStatusList();
      if (!result) throw new Error('Failed to fetch lead validation statuses');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
