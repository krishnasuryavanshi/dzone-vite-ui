import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { LineItemPicklistMappings } from '../lib/enums';

export const fetchLineItemFormPicklists = async (
  category: LineItemPicklistMappings,
) => {
  try {
    return authenticatedRequest({
      resource: ApiResources.Lookups,
      apiHost: ApiHost.CampaignService,
      params: {
        source: category,
      },
    });
  } catch (error) {}
};
