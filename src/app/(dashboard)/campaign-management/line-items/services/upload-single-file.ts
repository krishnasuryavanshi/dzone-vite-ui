import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const uploadSingleFile = async (formData: FormData) => {
  const data = await nextBackendRequest({
    resource: BackendResources.LineItemsFileUpload,
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'multipart/form-data',
    } as any,
    data: formData as any,
  });

  return data;
};
