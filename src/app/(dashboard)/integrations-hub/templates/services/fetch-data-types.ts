import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchDataTypes = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.DeliveryTemplatesFieldDataTypes,
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
