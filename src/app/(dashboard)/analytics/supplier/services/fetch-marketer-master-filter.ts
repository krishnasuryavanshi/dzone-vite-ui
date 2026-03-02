import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchMarketerMasterFilterList = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: BackendResources.MarketerFilterMaster,
    });
  } catch (error) {
    throw error;
  }
};
