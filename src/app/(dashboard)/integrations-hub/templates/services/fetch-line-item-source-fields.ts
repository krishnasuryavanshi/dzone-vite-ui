import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemSourceFields = async (lineItemId: string) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.GetLineItemSourceFields,
      params: { lineItemId },
    });
  } catch (error) {}
};
