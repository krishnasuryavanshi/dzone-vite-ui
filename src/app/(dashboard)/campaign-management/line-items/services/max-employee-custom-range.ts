import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const maxEmployeeCustomRange = async () => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.LineItemEmployeeCountRange,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
