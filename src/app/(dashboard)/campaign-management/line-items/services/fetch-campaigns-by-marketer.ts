import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchCampaignsByMarketer = async (tenantCode: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: ApiResources.FilterCampaignsByMarketer,
      apiHost: ApiHost.CampaignService,
      params: {
        tenantCode,
      },
    });
    return data;
  } catch (error) {}
};
