import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDataTypes = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.DeliveryTemplatesFieldDataTypes,
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
