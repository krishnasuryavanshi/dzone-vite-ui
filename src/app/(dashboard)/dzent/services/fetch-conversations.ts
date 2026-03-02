import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const fetchConversations = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DzentConversations,
      method: HttpMethod.GET,
    });
  } catch (error) {
    logError(error);
  }
};
