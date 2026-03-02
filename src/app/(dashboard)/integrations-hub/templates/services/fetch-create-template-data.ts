import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchCreateTemplateData = async (lineItemId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: ApiResources.DeliveryTemplateCoreDataForCreate,
      apiHost: ApiHost.CampaignDeliveryService,
      params: { lineItemId },
    });
    return { data };
  } catch (error) {}
};
