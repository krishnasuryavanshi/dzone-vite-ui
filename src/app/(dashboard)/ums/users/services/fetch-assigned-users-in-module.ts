import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAssignedUsersInModule = (moduleName: string) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.AssignedUsersInModule,
      params: { moduleName },
    });
  } catch (error) {}
};
