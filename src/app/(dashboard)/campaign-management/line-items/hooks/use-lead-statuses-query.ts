import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadStatusList } from '../../leads/services/fetch-lead-status-list';

export function useLeadStatusesQuery() {
  return useQuery({
    queryKey: queryKeys.leads.leadStatuses(),
    queryFn: async () => {
      const result = await fetchLeadStatusList();
      if (!result) throw new Error('Failed to fetch lead statuses');
      return result;
    },
    staleTime: 30 * 60 * 1000,
  });
}
