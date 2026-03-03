import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchDestinationDropdownFields = async (
  type: string,
  integrationId: string,
  formId?: string,
  lineItemId?: string,
) => {
  try {
    const resource = transformPath(ApiResources.DestinationDropdownFields, {
      integrationId,
    });
    const params: Record<string, string> = {};
    if (formId) params.formId = formId;
    if (lineItemId) params.lineItemId = lineItemId;
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params: Object.keys(params).length > 0 ? params : undefined,
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
