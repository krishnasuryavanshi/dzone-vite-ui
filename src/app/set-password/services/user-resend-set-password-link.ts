import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const userResendSetPasswordLink = async (token: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.UserResendSetPasswordLink, {
        token,
      }),
      method: HttpMethod.PUT,
    });
  } catch (error) {}
};
