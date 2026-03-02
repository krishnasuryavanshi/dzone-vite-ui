import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { IJob } from '../lib/types';

export interface JobMonitoringListResponse {
  data: IJob[];
  total: number;
}

export const fetchJobMonitoringJobs = async (
  page: number = 0,
  size: number = 25,
  lineItemId?: string,
  params?: Record<string, unknown>,
): Promise<JobMonitoringListResponse | null> => {
  try {
    return await nextBackendRequest({
      resource: BackendResources.JobMonitoringJobs,
      params: { page, size, ...(lineItemId && { lineItemId }), ...params },
    });
  } catch (error) {
    logError(error);
    return null;
  }
};
