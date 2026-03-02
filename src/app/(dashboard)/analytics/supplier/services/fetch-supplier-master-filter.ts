import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchSupplierMasterFilterList = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: ApiResources.SupplierFilterMasterUrl,
      apiHost: ApiHost.AnalyticsService,
    });
  } catch (error) {
    throw error;
  }
};
