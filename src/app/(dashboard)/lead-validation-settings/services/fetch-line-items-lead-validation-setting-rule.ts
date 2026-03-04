import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function fetchLineItemsLeadValidationSettingRule(
  lineItemId: string,
  leadValidationSettingId: string,
  ruleName: string,
) {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.LineItemsLeadValidationSettingByRuleName, {
        lineItemId,
        settingId: leadValidationSettingId,
        ruleName,
      }),
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
