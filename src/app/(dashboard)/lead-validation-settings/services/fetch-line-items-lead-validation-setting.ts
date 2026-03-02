import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchLineItemsLeadValidationSetting(
  lineItemId: string,
  leadValidationSettingId: string,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        ApiResources.LineItemsLeadValidationSettingById,
        {
          lineItemId,
          settingId: leadValidationSettingId,
        },
      ),
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
