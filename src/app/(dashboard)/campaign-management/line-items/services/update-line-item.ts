import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { pushAnalyticsLogs } from '@/services/analytics';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLineItem = async (data: any, lineItemId: string) => {
  try {
    const resource = transformPath(BackendResources.LineItemById, {
      lineItemId,
    });
    const result = nextBackendRequest({
      resource,
      method: HttpMethod.PUT,
      data,
    });

    if (data.jobTitleRecommendation) {
      pushAnalyticsLogs({
        jobTitleRecommendation: data.jobTitleRecommendation,
        lineItemId,
      });
    }

    return result;
  } catch (error) {}
};
