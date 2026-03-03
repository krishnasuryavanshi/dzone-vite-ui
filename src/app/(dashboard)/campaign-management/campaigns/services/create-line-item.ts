import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const createLineItem = async (data: any) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.LineItems,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
