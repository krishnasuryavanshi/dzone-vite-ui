import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchLineItemFormCustomQuestionSetNumber = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.LineItemsCustomQuestionSetNumbers,
      apiHost: ApiHost.CampaignService,
    });
  } catch (error) {}
};
