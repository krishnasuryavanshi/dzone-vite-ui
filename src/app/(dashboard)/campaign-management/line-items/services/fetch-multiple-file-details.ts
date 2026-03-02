import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const fetchMultipleFileDetails = async (fileIds: string[]) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.MultipleFileDetails,
      method: HttpMethod.POST,
      data: {
        fileIds,
      },
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
