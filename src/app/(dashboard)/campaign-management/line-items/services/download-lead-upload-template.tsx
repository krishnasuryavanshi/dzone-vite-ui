import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const downloadLeadUploadTemplate = async (
  lineItemId: string,
  validationSettingId: string,
  tenantCode: string,
) => {
  try {
    const queryParams = new URLSearchParams({
      lineItemId,
      validationSettingId,
      tenantCode,
    }).toString();
    const response = await nextBackendRequest({
      resource: `${BackendResources.DownloadLeadUploadTemplate}?${queryParams}`,
      responseType: 'arraybuffer',
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
