import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export const fetchFileUploadMetadata = async (fileTypeName: string) => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.FileUploadMetadata,
      apiHost: ApiHost.FileService,
      params: {
        fileTypeName,
      },
    });
    return data;
  } catch (error) {}
};
