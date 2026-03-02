import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadValidationHistory = async (
  lineItemId: string,
  trackingId: string,
  id: number,
) => {
  try {
    const resource = transformPath(ApiResources.LeadValidationHistory, {
      lineItemId,
    });
    return await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
      params: {
        trackingId,
        id,
      },
    });
  } catch (error) {
    return { isError: true, error };
  }
};
