import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest, showNotification } from '@/services';

export const exportDeliveryTemplateSample = async (templateId: string) => {
  try {
    const response = await nextBackendRequest({
      resource: transformPath(BackendResources.ExportDeliveryTemplateSample, {
        templateId,
      }),
      responseType: 'arraybuffer',
      requestName: 'exportDeliveryTemplateSample',
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({
      message: parsedError?.message,
      messageHeader: parsedError?.messageHeader,
      type: 'error',
    });
  }
};
