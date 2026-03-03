import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { pushAnalyticsLogs } from '@/services/analytics';
import { authenticatedRequest } from '@/services/backend-request';

export const createLineItem = async (data: any) => {
  try {
    const result = await authenticatedRequest({
      resource: ApiResources.LineItems,
      apiHost: ApiHost.CampaignService,
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
