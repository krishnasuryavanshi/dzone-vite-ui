import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLineItemStatus = async (lineItemId: string, data: any) => {
  try {
    const resource = transformPath(ApiResources.UpdateLineItemStatus, {
      lineItemId,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
