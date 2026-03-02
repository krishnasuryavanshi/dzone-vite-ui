import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchReservedDestinationNames = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryTemplateReservedDestinationNames,
    });
  } catch (error) {}
};
