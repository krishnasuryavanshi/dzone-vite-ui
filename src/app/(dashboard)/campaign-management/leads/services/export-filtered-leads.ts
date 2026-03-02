import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const exportFilteredLeads = async (
  resource: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.ExportLeads,
      method: HttpMethod.POST,
      data: { filters, resource },
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
