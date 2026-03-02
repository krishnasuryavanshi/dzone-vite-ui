import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateUser = async (data: Record<string, any>, userId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(BackendResources.UserById, { userId }),
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
