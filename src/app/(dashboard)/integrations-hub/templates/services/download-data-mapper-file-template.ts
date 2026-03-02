import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';

export const downloadDataMapperFileTemplate = async (type = '') => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.DownloadDataMapperFileTemplate,
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
      params: {
        type,
      },
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
