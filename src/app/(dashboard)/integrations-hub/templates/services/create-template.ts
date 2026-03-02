import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const createTemplate = async (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.SaveDeliveryTemplate,
      apiHost: ApiHost.CampaignDeliveryService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
