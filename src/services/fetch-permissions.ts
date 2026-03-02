import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from './backend-request';

export const fetchPermissions = async (request: { roleIds: string[] }) => {
  try {
    const data = await nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.Permissions,
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
