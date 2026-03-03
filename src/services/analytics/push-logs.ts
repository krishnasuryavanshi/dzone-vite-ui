import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const pushAnalyticsLogs = async (data: Record<string, any>) => {
  try {
    authenticatedRequest({
      resource: ApiResources.AnalyticsLogsJobTitleRecommendations,
      apiHost: ApiHost.AuditService,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
