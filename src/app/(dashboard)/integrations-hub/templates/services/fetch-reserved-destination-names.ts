import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchReservedDestinationNames = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.DeliveryTemplatesReservedDestinationNames,
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
