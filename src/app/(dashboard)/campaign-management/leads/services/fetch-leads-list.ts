import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchLeadsList = async (
  page: number,
  size: number,
  tenantCode?: string,
  lineItemUuId?: string | null,
  ...extraParams: Record<string, any>[]
) => {
  try {
    const params: Record<string, any> = {
      page,
      size,
      tenantCode,
      lineItemUuId,
      ...Object.assign({}, ...extraParams),
    };
    const data = await nextBackendRequest({
      resource: BackendResources.Leads,
      params,
    });

    return data;
  } catch (error) {}
};
