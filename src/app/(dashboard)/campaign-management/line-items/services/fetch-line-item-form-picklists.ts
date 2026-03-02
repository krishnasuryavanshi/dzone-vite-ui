import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemPicklistMappings } from '../lib/enums';

export const fetchLineItemFormPicklists = async (
  category: LineItemPicklistMappings,
) => {
  try {
    return nextBackendRequest({
      resource: ApiResources.Lookups,
      apiHost: ApiHost.CampaignService,
      params: {
        source: category,
      },
    });
  } catch (error) {}
};
