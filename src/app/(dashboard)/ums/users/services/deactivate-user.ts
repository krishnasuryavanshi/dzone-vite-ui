import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const deactivateUser = async (userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.DeactivateUser, { userId }),
      method: HttpMethod.PUT,
    });
  } catch (error) {}
};
