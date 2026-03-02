import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchIntegrationLabels = async (integrationType: string) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.IntegrationNames,
      params: { integrationType },
    });
  } catch (error) {}
};
