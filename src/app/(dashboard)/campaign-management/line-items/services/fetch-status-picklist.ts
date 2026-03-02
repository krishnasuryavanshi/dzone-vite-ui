import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { StatusPicklistData } from '@/public/mock/status-picklist';
import { nextBackendRequest } from '@/services/backend-request';

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

    const { data } = await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });

    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
