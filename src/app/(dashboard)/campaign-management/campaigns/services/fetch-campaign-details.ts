import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export const fetchCampaignDetails = async (campaignId: string, view = true) => {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(ApiResources.CampaignsById, { campaignId }),
      apiHost: ApiHost.CampaignService,
    });

    if (!view) return data;

    data.data = {
      ...data.data,
    };

    return data;
  } catch (error) {}
};
