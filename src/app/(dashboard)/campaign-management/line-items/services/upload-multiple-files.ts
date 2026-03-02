import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const uploadMultipleFiles = async (formData: FormData) => {
  const data = await nextBackendRequest({
    resource: BackendResources.LineItemsFileUploadMultiple,
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'multipart/form-data',
    } as any,
    data: formData as any,
  });

  return data;
};
