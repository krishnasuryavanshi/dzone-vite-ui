import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTemplateDetails = async (templateId: string) => {
  try {
    return nextBackendRequest({
      resource: transformPath(ApiResources.DeliveryTemplateDetails, {
        templateId,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
    });
  } catch (error) {}
};
