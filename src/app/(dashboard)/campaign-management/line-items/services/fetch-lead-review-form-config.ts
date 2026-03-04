import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchLeadReviewFormConfig = async (type: string, lineItemId?: string) => {
  try {
    // Build params object conditionally
    const params: any = { type };
    if (lineItemId) {
      params.lineItemId = lineItemId;
    }

    return authenticatedRequest({
      resource: ApiResources.LeadReviewFormConfig,
      apiHost: ApiHost.PlatformService,
      params,
    });
  } catch (error) {
    return { isError: true, error };
  }
};
