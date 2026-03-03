import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchRolesByType = async (types: string) => {
  try {
    const resource = transformPath(ApiResources.RolesByTypes, { types });
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.RBACService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
