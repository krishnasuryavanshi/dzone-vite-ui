import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchMarketersLeadValidationSettings(tenantCode: string) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        ApiResources.MarketersLeadValidationSettings,
        {
          tenantCode,
        },
      ),
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
