import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLineItemStatus = async (lineItemId: string, data: any) => {
  try {
    const resource = transformPath(BackendResources.UpdateLineItemStatus, {
      lineItemId,
    });
    return nextBackendRequest({
      resource,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
