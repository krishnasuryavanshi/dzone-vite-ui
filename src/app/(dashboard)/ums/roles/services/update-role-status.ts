import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const updateRoleStatus = async (roleId: string, status: string) => {
  try {
    const resource = BackendResources.UpdateRoleStatus;
    const data = await nextBackendRequest({
      resource,
      method: HttpMethod.POST,
      params: {
        roleId,
        status,
      },
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
