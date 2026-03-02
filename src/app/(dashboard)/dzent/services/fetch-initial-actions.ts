import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export async function fetchInitialActions() {
  try {
    return nextBackendRequest({
      resource: ApiResources.DzentInitialActions,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
