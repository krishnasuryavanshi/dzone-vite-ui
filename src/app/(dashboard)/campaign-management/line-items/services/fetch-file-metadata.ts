import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchFileMetadata = async (fileTypeName: string) => {
  try {
    const response = await nextBackendRequest({
      resource: ApiResources.LineItemsFileUploadMetaData,
      apiHost: ApiHost.FileService,
      params: {
        fileTypeName,
      },
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
