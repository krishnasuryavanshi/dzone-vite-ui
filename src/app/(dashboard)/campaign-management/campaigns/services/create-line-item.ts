import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const createLineItem = async (data: any) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.LineItems,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
