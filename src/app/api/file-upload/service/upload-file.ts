import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { apiRequest } from '@/services';

export async function uploadFile(requestData: any) {
  const formData = new FormData();
  formData.append('file', requestData.file);
  formData.append('isNetNewLead', requestData.isNetNewLead);
  formData.append('tenantCode', requestData.tenantCode);
  formData.append('lineItemId', requestData.lineItemId);
  try {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await apiRequest({
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      resource: ApiResources.UploadFile,
      data: formData as any,
      headers: headers as any,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
}
