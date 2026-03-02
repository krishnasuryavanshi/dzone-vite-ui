import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateOrganization = async (
  data: Record<string, any>,
  organizationId: string,
) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.OrganizationsById, {
        organizationId,
      }),
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
