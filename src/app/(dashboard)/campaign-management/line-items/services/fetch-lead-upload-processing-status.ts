import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchLeadUploadProcessingStatus = async (
  lineItemId: string,
  requestId?: string,
) => {
  try {
    const params: Record<string, string> = {
      lineItemId,
    };

    if (requestId) {
      params.requestId = requestId;
    }

    const response = await nextBackendRequest({
      resource: BackendResources.LeadUploadProcessingStatus,
      params,
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
