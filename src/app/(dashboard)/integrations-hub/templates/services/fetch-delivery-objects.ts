import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDeliveryObjects = async (
  type?: string,
  integrationId?: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryObjects,
      params: type && integrationId ? { type, integrationId } : undefined,
    });
  } catch (error) {}
};
