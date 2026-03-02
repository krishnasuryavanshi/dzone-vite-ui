import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export const fetchExportLeadsMetadata = async () => {
  try {
    return nextBackendRequest({
      resource: ApiResources.ExportLeadsMetadata,
      apiHost: ApiHost.FileService,
    });
  } catch (error) {}
};
