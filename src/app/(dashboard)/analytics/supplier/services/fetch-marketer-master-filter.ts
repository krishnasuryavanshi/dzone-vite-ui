import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchMarketerMasterFilterList = async () => {
  try {
    return authenticatedRequest({
      method: HttpMethod.GET,
      resource: ApiResources.MarketerFilterMasterUrl,
      apiHost: ApiHost.AnalyticsService,
    });
  } catch (error) {
    throw error;
  }
};
