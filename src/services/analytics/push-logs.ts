import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const pushAnalyticsLogs = async (data: Record<string, any>) => {
  try {
    nextBackendRequest({
      resource: BackendResources.PushAnalyticsLogs,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
