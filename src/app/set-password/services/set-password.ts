import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const setPassword = async (password: string, token: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.SetPassword, {
        token,
      }),
      method: HttpMethod.PUT,
      data: { password },
    });
  } catch (error) {}
};
