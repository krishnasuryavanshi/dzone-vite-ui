import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const maxEmployeeCustomRange = async () => {
  try {
    const { data } = await nextBackendRequest({
      resource: ApiResources.LineItemEmployeeCustomRange,
      apiHost: ApiHost.CampaignService,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
