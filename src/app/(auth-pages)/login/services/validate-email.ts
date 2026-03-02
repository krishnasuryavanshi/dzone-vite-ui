import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const validateUserEmail = async (email: string) => {
  return await nextBackendRequest({
    resource: ApiResources.ValidateUser,
    apiHost: ApiHost.RBACService,
    isAuthenticated: false,
    method: HttpMethod.POST,
    data: {
      email,
    },
  });
};
