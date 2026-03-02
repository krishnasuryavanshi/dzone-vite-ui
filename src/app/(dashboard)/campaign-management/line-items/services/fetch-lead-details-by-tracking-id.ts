import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string/transform-path';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchLeadDetailsById = async (id: number, tenantCode?: string) => {
  try {
    const resource = transformPath(ApiResources.LeadDetailsById, { id });
    const { data } = await nextBackendRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      params: {
        tenantCode,
        validationHistory: true,
      },
    });
    return data;
  } catch (error) {}
};
