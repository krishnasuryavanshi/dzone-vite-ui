import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchOrganization = async (organizationId: string) => {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(BackendResources.OrganizationsById, {
        organizationId,
      }),
    });

    return data;
  } catch (error) {}
};
