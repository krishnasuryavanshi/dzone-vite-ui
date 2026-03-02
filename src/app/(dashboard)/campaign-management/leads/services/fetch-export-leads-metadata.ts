import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchExportLeadsMetadata = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.ExportLeadsMetadata,
    });
  } catch (error) {}
};
