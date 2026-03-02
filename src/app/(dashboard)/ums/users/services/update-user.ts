import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateUser = async (data: Record<string, any>, userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.UpdateUserDetails, { username: userId }),
      method: HttpMethod.PUT,
      data,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
