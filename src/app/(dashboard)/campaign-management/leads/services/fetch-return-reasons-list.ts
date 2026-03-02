import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchReturnReasonsList = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.RejectReasons,
      apiHost: ApiHost.CommonService,
    });
  } catch (error) {}
};
