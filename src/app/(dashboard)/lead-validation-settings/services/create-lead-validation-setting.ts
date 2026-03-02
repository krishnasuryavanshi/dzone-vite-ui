import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function createLeadValidationSetting(
  tenantCode: string,
  requestData: Record<string, any>,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        ApiResources.MarketersLeadValidationSettings,
        {
          tenantCode,
        },
      ),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {}
}
