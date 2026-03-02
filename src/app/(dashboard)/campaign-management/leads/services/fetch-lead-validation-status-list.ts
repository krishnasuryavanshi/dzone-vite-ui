import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadValidationStatusList = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.LeadValidationStatusPicklist,
    });
  } catch (error) {}
};
