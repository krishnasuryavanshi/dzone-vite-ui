import { BackendResources } from '@/lib/enums';
import { apiRequest } from '@/services/api-request';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadValidationHistory = async (
  lineItemId: string,
  trackingId: string,
  id: number,
) => {
  try {
    return await nextBackendRequest({
      resource: BackendResources.LeadValidationHistory,
      params: {
        lineItemId,
        trackingId,
        id,
      },
    });
  } catch (error) {
    return { isError: true, error };
  }
};
