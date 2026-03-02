import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchOrganizationType = () => {
  try {
    return nextBackendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.OrganizationsType,
    });
  } catch (error) {}
};
