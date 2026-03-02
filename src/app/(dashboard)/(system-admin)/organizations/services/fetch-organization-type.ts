import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchOrganizationType = () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.OrganizationsType,
    });
  } catch (error) {}
};
