import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchIntegrationLabels = async (integrationType: string) => {
  try {
    const resource = transformPath(ApiResources.IntegrationNames, {
      integration_type: integrationType,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
