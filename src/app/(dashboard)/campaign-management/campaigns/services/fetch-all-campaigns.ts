import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { ICampaign } from '../lib/types';
import { logError } from '@/services/logger';

export const fetchAllCampaigns = async () => {
  try {
    const requestConfig = {
      resource: ApiResources.AllCampaigns,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.GET,
    };

    const data = await nextBackendRequest(requestConfig);
    data.data = data?.data.map((campaign: ICampaign) => ({
      ...campaign,
      campaignName: campaign.name,
    }));
    return data;
  } catch (error) {
    logError(error);
  }
};
