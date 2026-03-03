import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchWebformFormFields = async (
  type: string,
  integrationId: string,
  lineItemId?: string,
) => {
  try {
    const resource = transformPath(ApiResources.FormFieldsMapping, {
      integrationId,
    });
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params: lineItemId ? { lineItemId } : undefined,
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
