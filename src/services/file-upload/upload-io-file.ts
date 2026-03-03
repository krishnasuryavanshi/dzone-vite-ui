import { ApiHost } from '@/lib/constants';
import { apiRequest } from '@/services';
import { ApiResources, HttpMethod } from '@/lib/enums';

export async function uploadIOFile(requestData: any) {
  const formData = new FormData();
  formData.append('file', requestData.file);
  try {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await apiRequest({
      apiHost: ApiHost.CampaignService,
      method: HttpMethod.POST,
      resource: ApiResources.UploadIOFile,
      data: formData as any,
      headers: headers as any,
    });

    return { data };
  } catch (error) {
    return { isError: true, error };
  }
}
