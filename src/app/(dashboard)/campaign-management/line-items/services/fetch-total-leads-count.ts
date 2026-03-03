import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchTotalLeadsCount = async (lineItemId: string) => {
  try {
    const resource = transformPath(ApiResources.TotalLeadsCount, {
      lineItemId,
    });
    const { data } = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
