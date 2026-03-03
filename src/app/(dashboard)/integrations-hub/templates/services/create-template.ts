import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const createTemplate = async (data: Record<string, any>) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.SaveDeliveryTemplate,
      apiHost: ApiHost.CampaignDeliveryService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
