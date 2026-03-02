import { BackendResources, HttpMethod } from '@/lib/enums';
import { DzRecord } from '@/lib/types';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

interface IntegrationDetailsResponse {
  data: DzRecord[];
}

export const fetchIntegrationDetails = async (
  id: string,
): Promise<IntegrationDetailsResponse> => {
  try {
    const response = await nextBackendRequest({
      resource: `${BackendResources.Integrations}/${id}`,
      method: HttpMethod.GET,
    });

    // Handle both direct data response and wrapped response
    if (response && typeof response === 'object') {
      if ('data' in response) {
        return response;
      } else {
        // If response is the integration directly, wrap it
        return { data: response };
      }
    }

    return { data: [] };
  } catch (error) {
    logError(error);
    // Return null data on error
    return {
      data: [],
    };
  }
};
