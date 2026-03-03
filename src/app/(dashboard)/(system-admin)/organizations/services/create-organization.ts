import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const createOrganization = (data: Record<string, any>) => {
  try {
    return authenticatedRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.Organizations,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
