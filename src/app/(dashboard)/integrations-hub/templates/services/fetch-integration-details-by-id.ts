import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchIntegrationDetailsById = async (integrationId: string) => {
  try {
    const resource = transformPath(ApiResources.IntegrationById, {
      integrationId,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
