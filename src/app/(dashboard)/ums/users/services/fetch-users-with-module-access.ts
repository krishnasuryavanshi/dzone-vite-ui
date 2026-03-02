import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchUsersWithModuleAccess = (
  moduleName: string,
  tenantCode: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.UsersWithModuleAccess,
      params: { moduleName, tenantCode },
    });
  } catch (error) {}
};
