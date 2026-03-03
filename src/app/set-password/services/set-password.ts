import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const setPassword = async (password: string, token: string) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.SetPassword,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      isAuthenticated: false,
      data: { token, password },
    });
  } catch (error) {}
};
