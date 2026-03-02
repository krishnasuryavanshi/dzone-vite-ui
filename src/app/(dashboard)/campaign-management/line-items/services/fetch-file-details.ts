import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const fetchFileDetails = async (fileId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.FileDetails,
      params: { fileId },
    });

    return data;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
