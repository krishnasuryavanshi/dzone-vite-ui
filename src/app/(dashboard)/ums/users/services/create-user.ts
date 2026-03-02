import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const createUser = (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.Users,
      method: HttpMethod.POST,
      data,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
