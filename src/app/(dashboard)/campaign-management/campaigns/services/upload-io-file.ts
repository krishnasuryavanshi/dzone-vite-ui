import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const uploadIoFile = async (formData: FormData) => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.UploadIOFile,
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'multipart/form-data',
      } as any,
      data: formData as any,
    });

    return data;
  } catch (error) {
    throw error;
  }
};
