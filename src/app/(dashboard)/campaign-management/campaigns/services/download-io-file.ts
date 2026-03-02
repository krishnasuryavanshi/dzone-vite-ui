import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const downloadIOFile = async (campaignId: string, fileId: string) => {
  try {
    const resource = transformPath(BackendResources.DownloadIOFile, {
      campaignId,
    });
    const response = await nextBackendRequest({
      resource: resource,
      params: { fileId },
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError.message, type: 'error' });
  }
};
