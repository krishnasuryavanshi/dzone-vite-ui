import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const updateRoleStatus = async (roleId: string, status: string) => {
  try {
    const resource = transformPath(ApiResources.UpdateRoleStatus, {
      roleId,
      status,
    });
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
