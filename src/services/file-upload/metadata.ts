import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchFileUploadMetadata = async (fileTypeName: string) => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.FileUploadMetadata,
      apiHost: ApiHost.FileService,
      params: {
        fileTypeName,
      },
    });
    return data;
  } catch (error) {}
};
