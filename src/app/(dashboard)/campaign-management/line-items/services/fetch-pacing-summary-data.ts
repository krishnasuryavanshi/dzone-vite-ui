import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchPacingSummaryData = async (
  lineItemId: string,
  params?: Record<string, any>,
) => {
  try {
    const resource = transformPath(BackendResources.PacingPerformanceGrid, {
      lineItemId,
    });
    return await nextBackendRequest({ resource, params });
  } catch (error) {
    logError(error);
    return null;
  }
};
