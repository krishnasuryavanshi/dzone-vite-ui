import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function updateLineItemsLeadValidationSetting(
  lineItemId: string,
  leadValidationSettingId: string,
  requestData: Record<string, any>,
) {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.LineItemsLeadValidationSettingById, {
        lineItemId,
        settingId: leadValidationSettingId,
      }),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: requestData,
    });
  } catch (error) {}
}
