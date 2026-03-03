import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchIntegrationLabels = async (integrationType: string) => {
  try {
    const resource = transformPath(ApiResources.IntegrationNames, {
      integration_type: integrationType,
    });
    return authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
