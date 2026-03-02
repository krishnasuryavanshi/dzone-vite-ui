import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchPermissionsByRoleId = async (roleId: string) => {
  try {
    const resource = transformPath(BackendResources.PermissionsByRoleId, {
      roleId,
    });
    const data = await nextBackendRequest({
      resource,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
