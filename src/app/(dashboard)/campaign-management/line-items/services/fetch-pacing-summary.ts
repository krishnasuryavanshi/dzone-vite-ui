import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';

export const fetchPacingSummary = async (lineItemId: string) => {
  try {
    const resource = transformPath(BackendResources.PacingPerformanceSummary, {
      lineItemId,
    });
    return await nextBackendRequest({ resource });
  } catch (error) {
    logError(error);
    return null;
  }
};
