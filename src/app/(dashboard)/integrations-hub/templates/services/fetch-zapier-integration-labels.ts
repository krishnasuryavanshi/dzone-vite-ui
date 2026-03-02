import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchZapierIntegrationLabels = async (
  integrationType: string,
  label: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.IntegrationNames,
      params: {
        integrationType,
        label,
      },
    });
  } catch (error) {}
};
