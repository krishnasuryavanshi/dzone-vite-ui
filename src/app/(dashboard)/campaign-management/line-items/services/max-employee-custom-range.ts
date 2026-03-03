import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const maxEmployeeCustomRange = async () => {
  try {
    const { data } = await authenticatedRequest({
      resource: ApiResources.LineItemEmployeeCustomRange,
      apiHost: ApiHost.CampaignService,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
