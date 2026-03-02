import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchZapierIntegrationLabels = async (
  integrationType: string,
  label: string,
) => {
  try {
    const resource = transformPath(ApiResources.ZapierIntegrationNames, {
      integration_type: integrationType,
      label,
    });
    return nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
};
