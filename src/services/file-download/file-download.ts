import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { authenticatedRequest, showNotification } from '@/services';

export const fileDownload = async (fileId: string) => {
  try {
    const { data } = await authenticatedRequest({
      resource: transformPath(ApiResources.DownloadFile, { fileId }),
      apiHost: ApiHost.FileService,
    });
    if (data?.url) {
      const link = document.createElement('a');
      link.href = data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return {
        success: true,
        message: 'File downloaded successfully',
      };
    } else {
      const errorMsg = 'File download failed';
      showNotification({
        type: 'error',
        message: errorMsg,
      });
      return {
        success: false,
        message: errorMsg,
      };
    }
  } catch (error: any) {
    const errorMsg = error?.message || 'An error occurred while downloading the file';

    return {
      success: false,
      message: errorMsg,
    };
  }
};
