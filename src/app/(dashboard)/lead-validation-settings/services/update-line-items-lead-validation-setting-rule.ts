import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function updateLineItemsLeadValidationSettingRule(
  lineItemId: string,
  leadValidationSettingId: string,
  ruleName: string,
  requestData: Record<string, any>,
) {
  try {
    return authenticatedRequest({
      resource: transformPath(
        ApiResources.LineItemsLeadValidationSettingByRuleName,
        {
          lineItemId,
          settingId: leadValidationSettingId,
          ruleName,
        },
      ),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PATCH,
      data: requestData,
    });
  } catch (error) {}
}
