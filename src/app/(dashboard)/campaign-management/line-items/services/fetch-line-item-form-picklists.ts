import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemPicklistMappings } from '../lib/enums';

export const fetchLineItemFormPicklists = async (
  category: LineItemPicklistMappings,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.LineItemsPicklistOptions,
      params: {
        source: category,
      },
    });
  } catch (error) {}
};
