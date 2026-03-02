import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItems = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.GetLineItemsList,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
