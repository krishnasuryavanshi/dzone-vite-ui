import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const fetchConversationById = async (conversationId: string) => {
  try {
    const resource = transformPath(ApiResources.AiConversations, {
      conversationId,
    });

    return authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.GET,
    });
  } catch (error) {
    logError(error);
  }
};
