import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchDeliveryTemplatesByMarketer = async (
  marketerCode: string,
  lineItemId?: string,
) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.DeliveryTemplatesByMarketer, {
        marketerCode,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
      params: {
        lineItemId,
      },
    });
  } catch (error) {}
};
