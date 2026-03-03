import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

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
    return authenticatedRequest({
      resource: ApiResources.PaginatedUsers,
      params,
      apiHost: ApiHost.RBACService,
    });
  } catch (error) {}
};
