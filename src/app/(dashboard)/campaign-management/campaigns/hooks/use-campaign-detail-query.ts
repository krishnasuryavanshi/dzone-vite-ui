import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignDetails } from '../services';

export function useCampaignDetailQuery(campaignId: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(campaignId),
    queryFn: async () => {
      const result = await fetchCampaignDetails(campaignId);
      if (!result) throw new Error('Failed to fetch campaign details');
      return result;
    },
    enabled: !!campaignId,
  });
}
