import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchTemplateDetails = async (templateId: string) => {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.DeliveryTemplateDetails, {
        templateId,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
