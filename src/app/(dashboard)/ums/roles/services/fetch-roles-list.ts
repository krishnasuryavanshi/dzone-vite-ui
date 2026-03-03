import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchRolesList = async (page: number, size: number) => {
  try {
    const resource = ApiResources.FetchRolesByPagination;
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.RBACService,
      params: { page, size },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
