import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchRolesList = async (page: number, size: number) => {
  try {
    const resource = BackendResources.Roles;
    const data = await nextBackendRequest({
      resource,
      params: { page, size },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
