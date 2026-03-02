import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchFilteredLeadsByStatuses = async (
  lineItemId: string,
  page: number,
  size: number,
  tenantCode?: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const resource = transformPath(ApiResources.LeadsByStatuses, {
      lineItemId,
    });
    const data = await nextBackendRequest({
      method: HttpMethod.POST,
      resource,
      apiHost: ApiHost.CampaignService,
      params: {
        page,
        size,
      },
      data: { filters },
    });

    return data;
  } catch (error) {}
};
