import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const downloadLineItemFiles = async (lineItemId: string, data: any) => {
  try {
    const { fileType, fileId } = data;
    const resource = transformPath(BackendResources.FileDownloadLineItem, {
      lineItemId,
    });

    const response = await nextBackendRequest({
      resource,
      params: { fileType, fileId },
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });

    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
