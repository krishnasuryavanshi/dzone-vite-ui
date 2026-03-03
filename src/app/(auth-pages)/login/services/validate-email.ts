import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export const validateUserEmail = async (email: string) => {
  return await authenticatedRequest({
    resource: ApiResources.ValidateUser,
    apiHost: ApiHost.RBACService,
    isAuthenticated: false,
    method: HttpMethod.POST,
    data: {
      email,
    },
  });
};
