import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemFormCustomQuestionSetNumber = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.LineItemsCustomQuestionsSetNumber,
    });
  } catch (error) {}
};
