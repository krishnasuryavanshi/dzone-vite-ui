import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchMarketerMasterFilterList = async () => {
  try {
    return nextBackendRequest({
      method: HttpMethod.GET,
      resource: ApiResources.MarketerFilterMasterUrl,
      apiHost: ApiHost.AnalyticsService,
    });
  } catch (error) {
    throw error;
  }
};
