import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const updateCampaignCollaborators = async (
  data: Record<string, string[]>,
  campaignId: string,
) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.UpdateCampaignCollaborators,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.PUT,
      data: { id: campaignId, ...data },
    });
  } catch (error) {}
};
