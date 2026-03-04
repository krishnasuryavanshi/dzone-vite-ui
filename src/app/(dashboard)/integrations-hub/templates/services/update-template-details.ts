import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const updateTemplateDetails = async (templateId: string, data: Record<string, any>) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.DeliveryTemplateUpdateDetails, {
        templateId,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
