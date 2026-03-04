import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

interface IntegrationDetailsResponse {
  data: DzRecord[];
}

export const fetchIntegrationDetails = async (id: string): Promise<IntegrationDetailsResponse> => {
  try {
    const response = await authenticatedRequest({
      resource: ApiResources.DeliveryTemplatesByIntegration.replace('{integrationId}', id),
      apiHost: ApiHost.CampaignDeliveryService,
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
