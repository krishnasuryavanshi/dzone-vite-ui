import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchPacingSummaryData = async (
  lineItemId: string,
  params?: Record<string, any>,
) => {
  try {
    const resource = transformPath(ApiResources.PacingPerformanceGrid, {
      lineItemId,
    });
    return await authenticatedRequest({ resource, apiHost: ApiHost.PlatformService, params });
  } catch (error) {
    logError(error);
    return null;
  }
};
