import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const adminResendSetPasswordLink = async (userId: string) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.AdminResendSetPasswordLink, {
        username: userId,
      }),
      method: HttpMethod.PUT,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
