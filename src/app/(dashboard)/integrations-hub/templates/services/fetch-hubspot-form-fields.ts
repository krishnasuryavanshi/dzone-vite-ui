import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchHubspotFormFields = async (
  type: string,
  integrationId: string,
  formId: string,
  lineItemId?: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.HubspotFormFields,
      params: { type, integrationId, formId, lineItemId },
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
