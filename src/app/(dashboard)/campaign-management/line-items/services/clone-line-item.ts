import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const cloneLineItem = async (lineItemId: string, data: any) => {
  try {
    const resource = transformPath(BackendResources.CloneLineItem, {
      lineItemId,
    });
    return nextBackendRequest({
      resource,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
