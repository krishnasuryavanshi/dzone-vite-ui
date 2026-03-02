import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAllModules = async () => {
  try {
    const resource = ApiResources.RoleModules;
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.RBACService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
