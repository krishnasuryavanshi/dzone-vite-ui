import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchOrganizationType = () => {
  try {
    return authenticatedRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.OrganizationsType,
    });
  } catch (error) {}
};
