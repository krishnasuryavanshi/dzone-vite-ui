import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchCreateTemplateData = async (lineItemId: string) => {
  try {
    const { data } = await authenticatedRequest({
      resource: ApiResources.DeliveryTemplateCoreDataForCreate,
      apiHost: ApiHost.CampaignDeliveryService,
      params: { lineItemId },
    });
    return { data };
  } catch (error) {}
};
