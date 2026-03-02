import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTotalFilteredLeadsCount = async (
  lineItemId: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const { data } = await nextBackendRequest({
      method: HttpMethod.POST,
      resource: BackendResources.TotalFilteredLeadsCount,
      params: { lineItemId },
      data: { filters },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
