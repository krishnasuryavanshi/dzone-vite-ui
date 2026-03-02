import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';

export const downloadDataMapperFile = async (fileId: string) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.DownloadDataMapperFile,
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
      params: {
        fileId,
      },
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
