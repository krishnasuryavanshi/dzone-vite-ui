import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchLeadStatusList = async () => {
  try {
    return authenticatedRequest({
      method: HttpMethod.GET,
      resource: ApiResources.LeadStatuses,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
