import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const setPassword = async (password: string, token: string) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.SetPassword,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      isAuthenticated: false,
      data: { token, password },
    });
  } catch (error) {}
};
