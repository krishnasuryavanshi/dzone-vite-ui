import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest, showNotification } from '@/services';

export const downloadDataMapperFile = async (fileId: string) => {
  try {
    const response = await authenticatedRequest({
      resource: transformPath(ApiResources.DownloadDataMapperFile, { fileId }),
      apiHost: ApiHost.CampaignDeliveryService,
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
