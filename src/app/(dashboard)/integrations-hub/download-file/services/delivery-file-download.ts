import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export const deliveryFileDownload = async (token: string) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.DeliveryFileDownload,
      params: { token },
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
