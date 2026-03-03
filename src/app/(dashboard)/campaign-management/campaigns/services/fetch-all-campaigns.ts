import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { ICampaign } from '../lib/types';
import { logError } from '@/services/logger';

export const fetchAllCampaigns = async () => {
  try {
    const requestConfig = {
      resource: ApiResources.AllCampaigns,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.GET,
    };

    const data = await authenticatedRequest(requestConfig);
    data.data = data?.data.map((campaign: ICampaign) => ({
      ...campaign,
      campaignName: campaign.name,
    }));
    return data;
  } catch (error) {
    logError(error);
  }
};
