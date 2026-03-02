import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchActiveCampaignPicklist = async () => {
  try {
    const resource = ApiResources.ActiveCampaignsList;
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
