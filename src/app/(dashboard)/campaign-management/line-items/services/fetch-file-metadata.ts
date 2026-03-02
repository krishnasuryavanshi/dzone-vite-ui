import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchFileMetadata = async (fileTypeName: string) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.LineItemFileMetaData,
      params: {
        fileTypeName,
      },
    });
    return response;
  } catch (error: any) {
    return { isError: true, error };
  }
};
