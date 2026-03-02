import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const fetchConversationById = async (conversationId: string) => {
  try {
    const resource = transformPath(ApiResources.AiConversations, {
      conversationId,
    });

    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.GET,
    });
  } catch (error) {
    logError(error);
  }
};
