import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';
import { DownloadLineItemFilesType } from '../lib/enums';

const LineItemResources: Record<string, string> = {
  [DownloadLineItemFilesType.DownloadDeliveryTemplateFile]:
    ApiResources.DownloadDeliveryTemplateFile,
  [DownloadLineItemFilesType.DownloadIntentKeywordsFile]: ApiResources.DownloadIntentKeywordsFile,
  [DownloadLineItemFilesType.DownloadJobTitleListFile]: ApiResources.DownloadJobTitleListFile,
  [DownloadLineItemFilesType.DownloadSuppressionFile]: ApiResources.DownloadSuppressionFile,
  [DownloadLineItemFilesType.DownloadTALFile]: ApiResources.DownloadTALFile,
  [DownloadLineItemFilesType.DownloadTechnologyFile]: ApiResources.DownloadTechnologyFile,
};

export const downloadLineItemFiles = async (lineItemId: string, data: any) => {
  try {
    const { fileType, fileId } = data;
    const resource = LineItemResources[fileType as keyof typeof LineItemResources];

    const response = await authenticatedRequest({
      resource: `${resource}/${lineItemId}`,
      apiHost: ApiHost.CampaignService,
      params: { fileId },
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });

    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
