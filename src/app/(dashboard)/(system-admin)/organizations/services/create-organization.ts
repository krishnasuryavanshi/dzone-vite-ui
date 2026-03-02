import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const createOrganization = (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.Organizations,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
