import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { IRolePermissions } from '../lib/types';
import { transformPath } from '@/lib/utils/string';

export const updateRoleAndPermissionsByRoleId = async (
  roleId: string,
  newValues: IRolePermissions,
) => {
  try {
    const resource = transformPath(ApiResources.UpdateRole, {
      roleId,
    });
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      data: { ...newValues },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
