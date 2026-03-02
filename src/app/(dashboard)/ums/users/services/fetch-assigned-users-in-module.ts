import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAssignedUsersInModule = (moduleName: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.AssignedUsersInModule, { moduleName }),
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
