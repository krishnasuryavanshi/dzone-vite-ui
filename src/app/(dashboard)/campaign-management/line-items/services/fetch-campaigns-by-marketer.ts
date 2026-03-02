import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchCampaignsByMarketer = async (tenantCode: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.FilterCampaignsByMarketer,
      params: {
        tenantCode,
      },
    });
    return data;
  } catch (error) {}
};
