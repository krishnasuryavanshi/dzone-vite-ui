import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const createUser = (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.Users,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
