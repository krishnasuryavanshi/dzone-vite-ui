import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const updateTemplateDetails = async (
  templateId: string,
  data: Record<string, any>,
) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.DeliveryTemplateUpdateDetails, {
        templateId,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
      method: HttpMethod.PUT,
      data,
    });
  } catch (error) {}
};
