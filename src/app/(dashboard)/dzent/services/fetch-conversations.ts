import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const fetchConversations = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.AiTitle,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.GET,
    });
  } catch (error) {
    logError(error);
  }
};
