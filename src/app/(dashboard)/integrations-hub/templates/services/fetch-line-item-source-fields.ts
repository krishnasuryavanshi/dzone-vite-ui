import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemSourceFields = async (lineItemId: string) => {
  try {
    const resource = transformPath(ApiResources.LineItemSourceFields, {
      lineItemId,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
