import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLineItemCollaborators = async (
  data: Record<string, string[]>,
  lineItemId: string,
) => {
  try {
    const resource = transformPath(
      ApiResources.UpdateLineItemCollaborators,
      {
        lineItemId,
      },
    );
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
