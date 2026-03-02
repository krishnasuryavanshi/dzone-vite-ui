import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAllModules = async () => {
  try {
    const resource = BackendResources.AllModules;
    const data = await nextBackendRequest({
      resource,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
