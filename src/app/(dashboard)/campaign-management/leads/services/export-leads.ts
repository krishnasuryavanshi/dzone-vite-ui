import { BackendResources } from '@/lib/enums';
import { nextBackendRequest, showNotification } from '@/services';
import { AxiosHeaders } from 'axios';

export const exportLeads = async () => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.ExportLeads,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'blob',
      } as unknown as AxiosHeaders,
      includeResponseHeaders: true,
    });
    return response;
  } catch (error: any) {
    const fileErrorBytes = Buffer.from(error?.data);
    const fileErrorString = JSON.parse(fileErrorBytes.toString());
    showNotification({ message: fileErrorString?.message, type: 'error' });
  }
};
