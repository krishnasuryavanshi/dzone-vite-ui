import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export const uploadDataMapperFile = async (formData: FormData) => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.DeliveryTemplateUploadDataMapperFile,
      apiHost: ApiHost.CampaignDeliveryService,
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'multipart/form-data',
      } as any,
      data: formData as any,
    });

    return { data };
  } catch (error) {
    throw error;
  }
};
