import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const fetchFileDetails = async (fileId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: ApiResources.FileDetails,
      apiHost: ApiHost.FileService,
      params: { fileId },
    });

    return data;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
