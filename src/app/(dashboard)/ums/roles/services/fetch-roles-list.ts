import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchRolesList = async (page: number, size: number) => {
  try {
    const resource = ApiResources.FetchRolesByPagination;
    const data = await nextBackendRequest({
      resource,
      apiHost: ApiHost.RBACService,
      params: { page, size },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
