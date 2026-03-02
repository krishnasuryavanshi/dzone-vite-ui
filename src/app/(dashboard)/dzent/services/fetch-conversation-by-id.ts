import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const fetchConversationById = async (conversationId: string) => {
  try {
    const resource = transformPath(BackendResources.DzentConversationById, {
      conversationId,
    });

    return nextBackendRequest({
      resource,
      method: HttpMethod.GET,
    });
  } catch (error) {
    logError(error);
  }
};
