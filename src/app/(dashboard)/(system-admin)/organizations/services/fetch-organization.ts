import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchOrganization = async (organizationId: string) => {
  try {
    const data = await authenticatedRequest({
      apiHost: ApiHost.RBACService,
      resource: transformPath(ApiResources.OrganizationsById, {
        organizationId,
      }),
    });

    return data;
  } catch (error) {}
};
