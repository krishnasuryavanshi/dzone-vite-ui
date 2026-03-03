import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchLineItems = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.GetLineItemsList,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
