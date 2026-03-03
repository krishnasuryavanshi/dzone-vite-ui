import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { IRolePermissions } from '../lib/types';

export const saveRoleAndPermissions = async (data: IRolePermissions) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.SaveRoles,
      apiHost: ApiHost.RBACService,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
