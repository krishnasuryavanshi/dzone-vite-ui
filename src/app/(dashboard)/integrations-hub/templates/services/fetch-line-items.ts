import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItems = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.GetLineItemsList,
    });
  } catch (error) {}
};
