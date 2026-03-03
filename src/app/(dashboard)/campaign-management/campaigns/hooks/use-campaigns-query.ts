import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaigns } from '../services';
import { Filters } from '@/lib/utils/table';
import { ICampaign } from '../lib/types';

export function useCampaignsQuery(
  page: number,
  size: number,
  filters?: Filters<ICampaign>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.campaigns.list({ page, size, filters }),
    queryFn: async () => {
      const result = await fetchCampaigns(page, size, filters);
      if (!result) throw new Error('Failed to fetch campaigns');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
