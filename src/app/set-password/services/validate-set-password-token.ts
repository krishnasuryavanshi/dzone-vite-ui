import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const validateSetPasswordToken = async (token: string) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.ValidateSetPasswordToken, {
        token,
      }),
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      isAuthenticated: false,
    });
  } catch (error) {}
};
