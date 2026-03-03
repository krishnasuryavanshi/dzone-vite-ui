import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest, showNotification } from '@/services';

export const fileDownload = async (fileId: string) => {
  try {
    const resource = transformPath(ApiResources.FileDownload, { fileId });
    const { data } = await authenticatedRequest({
      resource,
      apiHost: ApiHost.FileService,
    });
    if (data?.url) {
      const link = document.createElement('a');
      link.href = data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showNotification({
        type: 'error',
        message: 'File download failed',
      });
    }
  } catch (error) {
    return { isError: true, error };
  }
};
