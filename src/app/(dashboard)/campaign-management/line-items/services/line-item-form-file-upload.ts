import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLineItemFormFileUpload = async (formData: FormData) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.LineItemsFileUpload,
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
