import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest, showNotification } from '@/services';
import { AxiosHeaders } from 'axios';

export const exportLeads = async () => {
  try {
    const response = await nextBackendRequest({
      resource: ApiResources.ExportLeads,
      apiHost: ApiHost.CampaignService,
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
