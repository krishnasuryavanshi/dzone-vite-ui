import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchReservedDestinationNames = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.DeliveryTemplatesReservedDestinationNames,
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
