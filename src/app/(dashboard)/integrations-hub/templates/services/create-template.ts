import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const createTemplate = async (data: Record<string, any>) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryTemplates,
      method: HttpMethod.POST,
      data,
    });
  } catch (error) {}
};
