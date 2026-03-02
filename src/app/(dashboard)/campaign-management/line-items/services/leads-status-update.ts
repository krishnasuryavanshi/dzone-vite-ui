import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const leadsStatusUpdate = async (
  leadUpdates: Array<{ leadStatus: string; id: number }>,
  tenantCode?: string,
) => {
  try {
    return await nextBackendRequest({
      resource: BackendResources.LeadsStatusUpdate,
      method: HttpMethod.PUT,
      data: {
        leadUpdates,
        tenantCode,
      },
    });
  } catch (error) {}
};
