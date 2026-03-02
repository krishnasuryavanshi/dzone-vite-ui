import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchReturnReasonsList = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.ReturnReasons,
    });
  } catch (error) {}
};
