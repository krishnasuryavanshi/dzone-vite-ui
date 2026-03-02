import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDeliveryTemplatesByMarketer = async (
  marketerCode: string,
  lineItemId?: string,
) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryTemplatesByMarketer,
      params: {
        marketerCode,
        lineItemId,
      },
    });
  } catch (error) {}
};
