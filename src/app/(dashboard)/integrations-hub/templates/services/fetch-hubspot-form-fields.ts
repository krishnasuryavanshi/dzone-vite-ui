import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchHubspotFormFields = async (
  type: string,
  integrationId: string,
  formId: string,
  lineItemId?: string,
) => {
  try {
    const resource = transformPath(ApiResources.FormFields, {
      type,
      integrationId,
      formId,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params: lineItemId ? { lineItemId } : undefined,
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
