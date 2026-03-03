import { HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const exportFilteredLeads = async (
  resource: string,
  filters: Record<string, any>[] = [],
) => {
  try {
    const response = await authenticatedRequest({
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
