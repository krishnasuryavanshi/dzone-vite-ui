import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchTemplates = async (page?: number, size?: number) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.DeliveryTemplates,
      apiHost: ApiHost.CampaignDeliveryService,
      params: { page, size },
    });
  } catch (error) {}
};
