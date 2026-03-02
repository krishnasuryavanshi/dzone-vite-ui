import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTotalFilteredLeadsCount = async (
  lineItemId: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const resource = transformPath(ApiResources.TotalFilteredLeadsCount, {
      lineItemId,
    });
    const { data } = await nextBackendRequest({
      method: HttpMethod.POST,
      resource,
      apiHost: ApiHost.CampaignService,
      data: { filters },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
