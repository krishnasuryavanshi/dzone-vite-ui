import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { ICampaign } from '../lib/types';
import { fetchCampaignDetails } from '../services';
import { prepareViewData } from '../lib/utils';
import { fetchFileDetails } from '../../line-items/services';

export function useCampaignDetailViewQuery(
  campaignId: string,
  restrictedFields: (string | false)[],
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.campaigns.detailView(campaignId, restrictedFields),
    queryFn: async () => {
      const data = await fetchCampaignDetails(campaignId);
      if (!data) throw new Error('Failed to fetch campaign details');

      let ioFileDetails = {};
      if (data?.data?.ioFileId) {
        ioFileDetails = await fetchFileDetails(data.data.ioFileId);
      }

      const viewData = prepareViewData(data?.data, { restrictedFields });
      return { ...viewData, ioFileId: ioFileDetails } as ICampaign;
    },
    enabled,
  });
}
