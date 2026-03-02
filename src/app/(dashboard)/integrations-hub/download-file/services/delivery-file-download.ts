import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const deliveryFileDownload = async (token: string) => {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(ApiResources.DownloadDeliveryFile, { token }),
      apiHost: ApiHost.PlatformService,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
