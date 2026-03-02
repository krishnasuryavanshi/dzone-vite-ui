import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchFilteredLeadsCount = async (
  filters: Record<string, any>[] = [],
) => {
  try {
    return nextBackendRequest({
      method: HttpMethod.POST,
      resource: BackendResources.ExportLeadsCount,
      data: { filters },
    });
  } catch (error) {}
};
