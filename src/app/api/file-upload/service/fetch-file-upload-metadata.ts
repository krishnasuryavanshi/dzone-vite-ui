import { ApiHost } from '@/lib/constants';
import { ApiResources } from '@/lib/enums';
import { apiRequest } from '@/services';

export async function fetchFileUploadMetadata(fileTypeName: string) {
  try {
    const { data } = await apiRequest({
      resource: ApiResources.FileUploadMetadata,
      apiHost: ApiHost.FileService,
      params: { fileTypeName },
    });
    return { data };
  } catch (error) {
    return { isError: true, error };
  }
}
