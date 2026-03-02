import { BackendResources } from '@/lib/enums';
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
      resource: BackendResources.LeadReviewFormConfig,
      params,
    });
  } catch (error) {
    return { isError: true, error };
  }
};
