import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest, showNotification } from '@/services';
import { transformPath } from '@/lib/utils/string/transform-path';
import { handleApiError } from '../../lib/utils';

export const exportLeadsFilteredByLeadAndValidationStatuses = async (
  lineItemId: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const resource = transformPath(
      ApiResources.ExportFilteredLeadsByStatusAndValidationStatuses,
      { lineItemId },
    );
    const response = await nextBackendRequest({
      resource,
      apiHost: ApiHost.FileService,
      method: HttpMethod.POST,
      data: { filters },
      responseType: 'arraybuffer',
      requestName: 'exportFilteredLeads',
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
