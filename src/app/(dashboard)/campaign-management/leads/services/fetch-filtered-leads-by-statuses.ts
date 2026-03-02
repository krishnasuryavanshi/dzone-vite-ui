import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchFilteredLeadsByStatuses = async (
  lineItemId: string,
  page: number,
  size: number,
  tenantCode?: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const data = await nextBackendRequest({
      method: HttpMethod.POST,
      resource: BackendResources.FilterLeadsByStatuses,
      params: {
        page,
        size,
        tenantCode,
        lineItemId,
      },
      data: { filters },
    });

    return data;
  } catch (error) {}
};
