import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { apiRequest } from '@/services';

export async function uploadTargetingFile(requestData: FormData) {
  try {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const { data } = await apiRequest({
      apiHost: ApiHost.FileService,
      method: HttpMethod.POST,
      resource: ApiResources.MultiFileUpload,
      data: requestData as any,
      headers: headers as any,
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
}
