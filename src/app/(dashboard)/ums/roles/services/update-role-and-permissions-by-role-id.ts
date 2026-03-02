import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { IRolePermissions } from '../lib/types';
import { transformPath } from '@/lib/utils/string';

export const updateRoleAndPermissionsByRoleId = async (
  roleId: string,
  newValues: IRolePermissions,
) => {
  try {
    const resource = transformPath(BackendResources.PermissionsByRoleId, {
      roleId,
    });
    const data = await nextBackendRequest({
      resource,
      method: HttpMethod.PUT,
      data: { ...newValues },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
