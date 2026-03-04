import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignsByMarketer } from '../services';

export function useCampaignsByMarketerQuery(tenantCode: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.campaigns.campaignsByMarketer(tenantCode ?? ''),
    queryFn: async () => {
      const result = await fetchCampaignsByMarketer(tenantCode!);
      if (!result) throw new Error('Failed to fetch campaigns by marketer');
      return result;
    },
    enabled: !!tenantCode && enabled,
  });
}
