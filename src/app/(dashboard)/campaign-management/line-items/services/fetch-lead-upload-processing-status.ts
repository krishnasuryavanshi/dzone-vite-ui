import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest } from '@/services';

export const fetchLeadUploadProcessingStatus = async (
  lineItemId: string,
  requestId?: string,
) => {
  try {
    const resource = transformPath(ApiResources.LeadUploadValidationCount, {
      lineItemId,
    });

    const params: Record<string, string> = {};
    if (requestId) {
      params.batchId = requestId;
    }

    const response = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params,
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
