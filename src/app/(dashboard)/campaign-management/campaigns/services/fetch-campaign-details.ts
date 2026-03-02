import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchCampaignDetails = async (campaignId: string, view = true) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.Campaigns + '/' + campaignId,
    });

    if (!view) return data;

    data.data = {
      ...data.data,
    };

    return data;
  } catch (error) {}
};
