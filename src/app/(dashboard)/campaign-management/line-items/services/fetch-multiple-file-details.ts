import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest, showNotification } from '@/services';
import { handleApiError } from '../../lib/utils';

export const fetchMultipleFileDetails = async (fileIds: string[]) => {
  try {
    const response = await authenticatedRequest({
      resource: ApiResources.MultipleFileDetails,
      apiHost: ApiHost.FileService,
      method: HttpMethod.POST,
      data: {
        fileIds,
      },
    });
    return response;
  } catch (error: any) {
    const parsedError = handleApiError(error);
    showNotification({ message: parsedError?.message, type: 'error' });
  }
};
