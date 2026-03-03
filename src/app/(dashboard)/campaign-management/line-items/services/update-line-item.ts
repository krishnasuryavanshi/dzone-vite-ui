import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { pushAnalyticsLogs } from '@/services/analytics';
import { authenticatedRequest } from '@/services/backend-request';

export const updateLineItem = async (data: any, lineItemId: string) => {
  try {
    const resource = transformPath(ApiResources.LineItemById, {
      lineItemId,
    });
    const result = authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
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
