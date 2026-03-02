import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchDataMapperFileUploadMetadata = async () => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.DeliveryTemplateUploadDataMapperFileMetadata,
      apiHost: ApiHost.CampaignDeliveryService,
    });

    return { data };
  } catch (error) {}
};
