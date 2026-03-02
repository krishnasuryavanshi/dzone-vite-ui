import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export async function fetchConversationFiles(id: string) {
  try {
    return nextBackendRequest({
      resource: ApiResources.DzentConversationFiles,
      apiHost: ApiHost.PlatformService,
      params: { id },
    });
  } catch (error) {}
}
