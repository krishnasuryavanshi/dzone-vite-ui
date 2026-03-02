import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchDataMapperFileUploadMetadata = async () => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.UploadDataMapperFileMetadata,
    });

    return { data };
  } catch (error) {}
};
