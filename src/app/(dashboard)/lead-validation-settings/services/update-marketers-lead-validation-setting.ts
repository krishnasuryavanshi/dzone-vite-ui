import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function updateMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
  requestData: Record<string, any>,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        ApiResources.MarketersLeadValidationSettingById,
        {
          tenantCode,
          settingId: leadValidationSettingId,
        },
      ),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: requestData,
    });
  } catch (error) {}
}
