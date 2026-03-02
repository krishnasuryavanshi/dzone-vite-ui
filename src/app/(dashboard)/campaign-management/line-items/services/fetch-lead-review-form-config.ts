import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadReviewFormConfig = async (
  type: string,
  lineItemId?: string,
) => {
  try {
    // Build params object conditionally
    const params: any = { type };
    if (lineItemId) {
      params.lineItemId = lineItemId;
    }

    return nextBackendRequest({
      resource: ApiResources.LeadReviewFormConfig,
      apiHost: ApiHost.PlatformService,
      params,
    });
  } catch (error) {
    return { isError: true, error };
  }
};
