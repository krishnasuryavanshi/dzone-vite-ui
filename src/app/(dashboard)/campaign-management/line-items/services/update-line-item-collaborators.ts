import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const updateLineItemCollaborators = async (
  data: Record<string, string[]>,
  lineItemId: string,
) => {
  try {
    const resource = transformPath(ApiResources.UpdateLineItemCollaborators, {
      lineItemId,
    });
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
