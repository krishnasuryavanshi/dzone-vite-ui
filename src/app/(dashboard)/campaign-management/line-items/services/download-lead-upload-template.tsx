import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const downloadLeadUploadTemplate = async (
  lineItemId: string,
  validationSettingId: string,
  tenantCode: string,
) => {
  try {
    const response = await authenticatedRequest({
      resource: ApiResources.DownloadLeadUploadTemplate,
      apiHost: ApiHost.FileService,
      params: { lineItemId, validationSettingId, tenantCode },
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
