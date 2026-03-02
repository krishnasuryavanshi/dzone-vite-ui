import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemFormCustomQuestionSetNumber = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.LineItemsCustomQuestionSetNumbers,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
