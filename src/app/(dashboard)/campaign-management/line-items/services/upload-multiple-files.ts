import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const uploadMultipleFiles = async (formData: FormData) => {
  const data = await nextBackendRequest({
    resource: ApiResources.LineItemMultipleFileUploads,
    apiHost: ApiHost.FileService,
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'multipart/form-data',
    } as any,
    data: formData as any,
  });

  return data;
};
