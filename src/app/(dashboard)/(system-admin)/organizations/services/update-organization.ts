import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const updateOrganization = async (data: Record<string, any>, organizationId: string) => {
  try {
    return authenticatedRequest({
      apiHost: ApiHost.RBACService,
      resource: transformPath(ApiResources.OrganizationsById, {
        organizationId,
      }),
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
