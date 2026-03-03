import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export const fetchExportLeadsMetadata = async () => {
  try {
    return authenticatedRequest({
      resource: ApiResources.ExportLeadsMetadata,
      apiHost: ApiHost.FileService,
    });
  } catch (error) {}
};
