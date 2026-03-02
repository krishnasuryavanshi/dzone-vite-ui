import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services';

export const resetPassword = async (email: string) => {
  const data = await nextBackendRequest({
    resource: transformPath(ApiResources.ResetPassword, {
      username: email,
    }),
    apiHost: ApiHost.RBACService,
    isAuthenticated: false,
    method: HttpMethod.PATCH,
  });
  return data;
};
