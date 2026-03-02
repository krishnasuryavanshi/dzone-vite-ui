import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchFileUploadMetadata = async (fileTypeName: string) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.FileUploadMetadata,
      params: {
        fileTypeName,
      },
    });
    return data;
  } catch (error) {}
};
