import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const updateCampaignCollaborators = async (
  data: Record<string, string[]>,
  campaignId: string,
) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.UpdateCampaignCollaborators,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.PUT,
      data: { id: campaignId, ...data },
    });
  } catch (error) {}
};
