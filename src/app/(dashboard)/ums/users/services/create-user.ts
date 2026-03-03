import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const createUser = (data: Record<string, any>) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.Users,
      method: HttpMethod.POST,
      data,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
