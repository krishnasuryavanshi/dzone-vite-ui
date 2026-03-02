import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchUser = async (userId: string) => {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(BackendResources.UserById, { userId }),
    });

    return data;
  } catch (error) {}
};
