import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchPermissionsByRoleId = async (roleId: string) => {
  try {
    const resource = transformPath(ApiResources.RoleDetails, {
      roleId,
    });
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.RBACService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
