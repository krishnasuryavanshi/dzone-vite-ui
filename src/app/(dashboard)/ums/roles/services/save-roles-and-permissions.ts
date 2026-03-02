import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { IRolePermissions } from '../lib/types';

export const saveRoleAndPermissions = async (data: IRolePermissions) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.SaveRoles,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
