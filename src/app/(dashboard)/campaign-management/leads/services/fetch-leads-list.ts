import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchLeadsList = async (
  page: number,
  size: number,
  tenantCode?: string,
  lineItemUuId?: string | null,
  ...extraParams: Record<string, any>[]
) => {
  try {
    const resource = lineItemUuId
      ? transformPath(ApiResources.LeadsByLineItemId, {
          lineItemId: lineItemUuId,
        })
      : ApiResources.Leads;
    const params: Record<string, any> = {
      page,
      size,
      ...Object.assign({}, ...extraParams),
    };
    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params,
    });

    return data;
  } catch (error) {}
};
