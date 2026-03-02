import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTotalLeadsCount = async (lineItemId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.TotalLeadsCount,
      params: { lineItemId },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
