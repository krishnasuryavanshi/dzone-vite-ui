import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { IntegrationTypesResponse } from '../lib/types/integration';

export const fetchIntegrationTypes =
  async (): Promise<IntegrationTypesResponse> => {
    try {
      const data = await nextBackendRequest({
        resource: BackendResources.IntegrationTypes,
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
