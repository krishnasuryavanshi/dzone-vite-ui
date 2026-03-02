import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const cloneCampaign = async (campaignId: string) => {
  try {
    const resource = transformPath(BackendResources.CloneCampaign, {
      campaignId,
    });
    return nextBackendRequest({
      resource,
      method: HttpMethod.POST,
    });
  } catch (error) {}
};
