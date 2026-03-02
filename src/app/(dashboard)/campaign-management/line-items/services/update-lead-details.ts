import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

export const updateLeadDetails = async (
  id: number,
  leadData: Record<string, any>,
  tenantCode?: string,
) => {
  try {
    const resource = transformPath(ApiResources.LeadDetailsById, { id });
    return await nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      headers: { tenantCode: tenantCode || '' } as any,
      data: { ...leadData },
    });
  } catch (error) {}
};
