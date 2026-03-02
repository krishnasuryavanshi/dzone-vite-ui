import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadStatusList = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: BackendResources.LeadStatusPicklist,
    });
  } catch (error) {}
};
