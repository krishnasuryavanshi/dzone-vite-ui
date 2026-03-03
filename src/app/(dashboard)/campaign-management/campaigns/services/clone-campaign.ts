import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const cloneCampaign = async (campaignId: string) => {
  try {
    const resource = transformPath(ApiResources.CloneCampaign, {
      campaignId,
    });
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
    });
  } catch (error) {}
};
