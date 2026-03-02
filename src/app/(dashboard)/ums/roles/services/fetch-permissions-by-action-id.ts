import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchPermissionsByActionId = async (
  actionId: string,
  moduleId: string,
) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.PermissionsByActionId,
      params: {
        actionId,
        moduleId,
      },
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
