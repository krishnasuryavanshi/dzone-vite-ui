import { BackendResources, HttpMethod } from '@/lib/enums';
import { pushAnalyticsLogs } from '@/services/analytics';
import { nextBackendRequest } from '@/services/backend-request';

export const createLineItem = async (data: any) => {
  try {
    const result = await nextBackendRequest({
      resource: BackendResources.LineItems,
      method: HttpMethod.POST,
      data,
    });

    if (data.jobTitleRecommendation) {
      pushAnalyticsLogs({
        jobTitleRecommendation: data.jobTitleRecommendation,
        lineItemId: result.id,
      });
    }

    return result;
  } catch (error) {}
};
