import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchIntegrationDetailsById = async (integrationId: string) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.IntegrationById,
      params: { integrationId },
    });
  } catch (error) {}
};
