import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const activateUser = async (userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.ActivateUserStatus, { username: userId }),
      method: HttpMethod.PUT,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
