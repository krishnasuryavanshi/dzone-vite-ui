import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from './backend-request';

export const fetchPermissions = async (request: { roleIds: string[] }) => {
  try {
    const resource = BackendResources.Permissions;
    const data = await nextBackendRequest({
      resource,
      method: HttpMethod.POST,
      data: {
        roleIds: request.roleIds,
      },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
