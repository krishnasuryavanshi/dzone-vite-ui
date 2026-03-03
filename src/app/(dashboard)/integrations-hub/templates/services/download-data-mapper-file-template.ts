import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';

export const downloadDataMapperFileTemplate = async (type = '') => {
  try {
    const response = await authenticatedRequest({
      resource: ApiResources.DownloadDataMapperUploadTemplate,
      apiHost: ApiHost.CampaignDeliveryService,
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
