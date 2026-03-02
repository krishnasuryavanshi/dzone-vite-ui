import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchOrganization = async (organizationId: string) => {
  try {
    const data = await nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: transformPath(ApiResources.OrganizationsById, {
        organizationId,
      }),
    });

    return data;
  } catch (error) {}
};
