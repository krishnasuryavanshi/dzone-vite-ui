import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchWebformFormFields = async (
  type: string,
  integrationId: string,
  lineItemId?: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.WebFormFormFields,
      params: { type, integrationId, lineItemId },
    });
  } catch (error) {
    // Error fetching form fields
    return { error };
  }
};
