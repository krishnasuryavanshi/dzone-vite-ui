import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const cloneLineItem = async (lineItemId: string, data: any) => {
  try {
    const resource = transformPath(ApiResources.CloneLineItem, {
      lineItemId,
    });
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
