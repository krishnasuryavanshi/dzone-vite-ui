import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateCampaignCollaborators = async (
  data: Record<string, string[]>,
  campaignId: string,
) => {
  try {
    const resource = transformPath(
      BackendResources.UpdateCampaignCollaborators,
      {
        campaignId,
      },
    );
    return nextBackendRequest({
      resource,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
