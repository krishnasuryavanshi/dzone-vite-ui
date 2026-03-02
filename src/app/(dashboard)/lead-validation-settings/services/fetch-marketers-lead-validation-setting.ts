import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
): Promise<any> {
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
    });
  } catch (error) {}
}
