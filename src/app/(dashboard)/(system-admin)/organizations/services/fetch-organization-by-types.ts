import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchOrganizationsByType = async (
  types: string,
  userId?: string,
) => {
  try {
    const resource = BackendResources.OrganizationsByType;
    const data = await nextBackendRequest({
      resource,
      params: { types, userId },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
