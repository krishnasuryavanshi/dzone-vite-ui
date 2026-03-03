import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const downloadIOFile = async (campaignId: string, fileId: string) => {
  try {
    const resource = `${ApiResources.DownloadIOFile}/${campaignId}`;
    const response = await authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
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
