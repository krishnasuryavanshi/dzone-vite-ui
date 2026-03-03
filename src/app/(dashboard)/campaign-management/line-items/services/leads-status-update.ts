import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const leadsStatusUpdate = async (
  leadUpdates: Array<{ leadStatus: string; id: number }>,
  tenantCode?: string,
) => {
  try {
    return await authenticatedRequest({
      resource: ApiResources.UpdateLeadsStatus,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: leadUpdates,
      headers: { tenantCode: tenantCode || '' } as any,
    });
  } catch (error) {}
};
