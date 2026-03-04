import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchUsersWithModuleAccess = (moduleName: string, tenantCode: string) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.UsersWithModuleAccess, { moduleName }),
      params: { tenantCode },
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
