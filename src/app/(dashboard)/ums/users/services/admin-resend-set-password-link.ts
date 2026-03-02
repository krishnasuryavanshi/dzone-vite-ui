import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const adminResendSetPasswordLink = async (userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.AdminResendSetPasswordLink, {
        username: userId,
      }),
      method: HttpMethod.PUT,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
