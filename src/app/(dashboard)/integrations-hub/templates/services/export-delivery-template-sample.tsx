import { handleApiError } from '@/app/(dashboard)/campaign-management/lib/utils';
import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest, showNotification } from '@/services';

export const exportDeliveryTemplateSample = async (templateId: string) => {
  try {
    const response = await nextBackendRequest({
      resource: transformPath(ApiResources.ExportSampleDeliveryTemplate, {
        templateId,
      }),
      apiHost: ApiHost.CampaignDeliveryService,
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
