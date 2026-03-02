import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { IRolePermissions } from '../lib/types';

export const saveRoleAndPermissions = async (data: IRolePermissions) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.Roles,
      method: HttpMethod.POST,
      data: { ...data },
    });
  } catch (error) {}
};
