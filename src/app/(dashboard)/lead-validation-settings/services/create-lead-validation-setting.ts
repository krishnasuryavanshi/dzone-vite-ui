import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function createLeadValidationSetting(
  tenantCode: string,
  requestData: Record<string, any>,
) {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.MarketersLeadValidationSettings, {
        tenantCode,
      }),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {}
}
