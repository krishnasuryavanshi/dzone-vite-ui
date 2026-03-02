import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchRolesByType = async (types: string) => {
  try {
    const resource = BackendResources.RolesByTypes;
    const data = await nextBackendRequest({
      resource,
      params: { types },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
