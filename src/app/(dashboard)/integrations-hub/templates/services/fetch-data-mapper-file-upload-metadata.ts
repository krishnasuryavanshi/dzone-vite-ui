import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export const fetchDataMapperFileUploadMetadata = async () => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.DeliveryTemplateUploadDataMapperFileMetadata,
      apiHost: ApiHost.CampaignDeliveryService,
    });

    return { data };
  } catch (error) {}
};
