import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLeadDetails = async (
  id: number,
  leadData: Record<string, any>,
  tenantCode?: string,
) => {
  try {
    return await nextBackendRequest({
      resource: BackendResources.UpdateLeadDetailsById,
      method: HttpMethod.PUT,
      data: {
        id,
        leadData,
        tenantCode,
      },
    });
  } catch (error) {}
};
