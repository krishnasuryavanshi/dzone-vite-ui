import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchActiveCampaignPicklist = async () => {
  try {
    const resource = ApiResources.ActiveCampaignsList;
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
