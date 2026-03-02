import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchSupplierMasterFilterList = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: BackendResources.SupplierFilterMaster,
    });
  } catch (error) {
    throw error;
  }
};
