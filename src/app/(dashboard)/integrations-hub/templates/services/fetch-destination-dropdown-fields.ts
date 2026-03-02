import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDestinationDropdownFields = async (
  type: string,
  integrationId: string,
  formId?: string,
  lineItemId?: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DestinationDropdownFields,
      params: { type, integrationId, formId, lineItemId },
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
