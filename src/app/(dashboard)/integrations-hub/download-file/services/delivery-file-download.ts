import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const deliveryFileDownload = async (token: string) => {
  try {
    const data = await authenticatedRequest({
      resource: transformPath(ApiResources.DownloadDeliveryFile, { token }),
      apiHost: ApiHost.PlatformService,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
