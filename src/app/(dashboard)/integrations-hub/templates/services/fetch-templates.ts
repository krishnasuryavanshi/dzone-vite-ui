import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchTemplates = async (page?: number, size?: number) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryTemplates,
      params: { page, size },
    });
  } catch (error) {}
};
