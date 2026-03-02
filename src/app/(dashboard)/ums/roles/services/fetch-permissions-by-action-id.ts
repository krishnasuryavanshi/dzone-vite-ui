import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchPermissionsByActionId = async (
  actionId: string,
  moduleId: string,
) => {
  try {
    const resource = transformPath(ApiResources.PermissionsByActionId, {
      moduleId,
      actionId,
    });
    const { data } = await nextBackendRequest({
      resource,
      apiHost: ApiHost.RBACService,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
