import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignStatuses } from '../services';

export function useCampaignStatusesQuery() {
  return useQuery({
    queryKey: queryKeys.campaigns.statuses(),
    queryFn: async () => {
      const result = await fetchCampaignStatuses();
      if (!result) throw new Error('Failed to fetch campaign statuses');
      return result;
    },
    staleTime: 30 * 60 * 1000, // 30 min — statuses rarely change
    gcTime: 60 * 60 * 1000, // 1 hour cache
  });
}
