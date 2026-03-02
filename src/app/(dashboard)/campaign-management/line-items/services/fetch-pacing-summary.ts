import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchPacingSummary = async (lineItemId: string) => {
  try {
    const resource = transformPath(ApiResources.PacingPerformanceSummary, {
      lineItemId,
    });
    return await nextBackendRequest({ resource, apiHost: ApiHost.PlatformService });
  } catch (error) {
    logError(error);
    return null;
  }
};
