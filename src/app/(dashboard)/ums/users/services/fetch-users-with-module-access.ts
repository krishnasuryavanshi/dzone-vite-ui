import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchUsersWithModuleAccess = (
  moduleName: string,
  tenantCode: string,
) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.UsersWithModuleAccess, { moduleName }),
      params: { tenantCode },
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
