import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchReviewLeadsList = async (
  lineItemId: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    return await nextBackendRequest({
      resource: BackendResources.LeadsReviewList,
      method: HttpMethod.POST,
      data: { lineItemId, filters },
    });
  } catch (error) {}
};
