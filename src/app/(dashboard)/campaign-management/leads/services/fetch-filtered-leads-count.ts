import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchFilteredLeadsCount = async (
  filters: Record<string, any>[] = [],
) => {
  try {
    return nextBackendRequest({
      method: HttpMethod.POST,
      resource: ApiResources.FilteredLeadsCount,
      apiHost: ApiHost.FileService,
      data: { filters },
    });
  } catch (error) {}
};
