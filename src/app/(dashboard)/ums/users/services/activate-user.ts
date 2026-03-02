import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const activateUser = async (userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.ActivateUser, { userId }),
      method: HttpMethod.PUT,
    });
  } catch (error) {}
};
