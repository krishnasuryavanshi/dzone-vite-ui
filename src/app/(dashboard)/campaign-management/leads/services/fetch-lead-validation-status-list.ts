import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadValidationStatusList = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.LeadValidationStatuses,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
