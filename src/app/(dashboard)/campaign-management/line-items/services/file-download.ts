import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';

export const fileDownload = async (fileId: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.FileDownloadLineItem,
      params: {
        fileId,
      },
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
