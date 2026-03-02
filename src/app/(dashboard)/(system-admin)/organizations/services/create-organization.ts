import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const createOrganization = (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.Organizations,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
