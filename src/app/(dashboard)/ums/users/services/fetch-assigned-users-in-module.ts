import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchAssignedUsersInModule = (moduleName: string) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.AssignedUsersInModule, { moduleName }),
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
