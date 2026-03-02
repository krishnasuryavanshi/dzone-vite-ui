import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchDataTypes = async () => {
  try {
    return nextBackendRequest({
      resource: BackendResources.DeliveryTemplateDataTypes,
    });
  } catch (error) {}
};
