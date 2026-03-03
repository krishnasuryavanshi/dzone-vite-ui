import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchLeadValidationStatusList = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.LeadValidationStatuses,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
