import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadDetailsById = async (id: number, tenantCode?: string) => {
  try {
    const { data } = await nextBackendRequest({
      resource: BackendResources.LeadDetailsById,
      params: {
        id,
        tenantCode,
      },
    });
    return data;
  } catch (error) {}
};
