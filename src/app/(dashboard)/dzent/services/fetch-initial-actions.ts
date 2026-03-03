import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export async function fetchInitialActions() {
  try {
    return authenticatedRequest({
      resource: ApiResources.DzentInitialActions,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
