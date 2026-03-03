import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchReturnReasonsList = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.RejectReasons,
      apiHost: ApiHost.CommonService,
    });
  } catch (error) {}
};
