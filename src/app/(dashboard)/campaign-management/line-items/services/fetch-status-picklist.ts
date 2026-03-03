import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { StatusPicklistData } from '@/public/mock/status-picklist';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchStatusPicklist = async () => {
  try {
    const resource = ApiResources.LineItemStatusLookup;

    if (!resource) {
      return {
        data: {
          data: StatusPicklistData,
          message: 'Status picklist data fetched successfully',
        },
      };
    }

    const { data } = await authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });

    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
