import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemStatuses = async () => {
  try {
    const statuses = await nextBackendRequest({
      resource: ApiResources.LineItemStatusLookup,
      apiHost: ApiHost.CampaignService,
    });
    return statuses.data.map((status: any) => {
      return {
        text: status.value,
        value: status.name,
      };
    });
  } catch (error) {}
};
