import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export async function fetchConversationFiles(id: string) {
  try {
    return authenticatedRequest({
      resource: ApiResources.DzentConversationFiles,
      apiHost: ApiHost.PlatformService,
      params: { id },
    });
  } catch (error) {}
}
