import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDeliveryObjects = async (
  type?: string,
  integrationId?: string,
) => {
  try {
    const resource =
      type && integrationId
        ? transformPath(ApiResources.DeliveryObjects, { type, integrationId })
        : ApiResources.DeliveryObjects;
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
