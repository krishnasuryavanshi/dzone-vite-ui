import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchReviewLeadsList = async (
  lineItemId: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    return await authenticatedRequest({
      resource: ApiResources.LeadsDetails,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: { lineItemId, filters },
    });
  } catch (error) {}
};
