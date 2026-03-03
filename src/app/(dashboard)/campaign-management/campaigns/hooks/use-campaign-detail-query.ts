import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignDetails } from '../services';

export function useCampaignDetailQuery(campaignId: string, view = true) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(campaignId),
    queryFn: async () => {
      const result = await fetchCampaignDetails(campaignId, view);
      if (!result) throw new Error('Failed to fetch campaign details');
      return result;
    },
    enabled: !!campaignId,
  });
}
