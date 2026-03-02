import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const validateSetPasswordToken = async (token: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.ValidateSetPasswordToken, {
        token,
      }),
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      isAuthenticated: false,
    });
  } catch (error) {}
};
