import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { IntegrationsResponse } from '../lib/types/integration';

export const fetchIntegrations = async (): Promise<IntegrationsResponse> => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.Integrations,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.GET,
    });
    return data;
  } catch (error) {
    logError(error);
    // Return empty data on error
    return {
      data: [],
      currentPage: 0,
      lastPage: 0,
      total: 0,
      perPage: 0,
      firstPageUrl: '',
      lastPageUrl: '',
      nextPageUrl: null,
      prevPageUrl: null,
    };
  }
};
