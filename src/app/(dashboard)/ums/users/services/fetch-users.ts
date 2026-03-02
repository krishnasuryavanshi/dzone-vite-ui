import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchUsers = (
  page: number,
  size: number,
  roleId?: string,
  username?: string,
  org?: string,
) => {
  const params: Record<string, string | number> = { page, size };
  if (roleId) {
    params.roleId = roleId;
  }
  if (username) {
    params.username = username;
  }
  if (org) {
    params.org = org;
  }
  try {
    return nextBackendRequest({
      resource: BackendResources.Users,
      params,
    });
  } catch (error) {}
};
