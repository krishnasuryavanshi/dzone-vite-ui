import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchUser = async (userId: string) => {
  try {
    const data = await authenticatedRequest({
      resource: transformPath(ApiResources.UserDetails, { userId }),
      apiHost: ApiHost.RBACService,
    });

    return data;
  } catch (error) {}
};
