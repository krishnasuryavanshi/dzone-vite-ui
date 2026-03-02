import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchLineItemsLeadValidationSettingRule(
  lineItemId: string,
  leadValidationSettingId: string,
  ruleName: string,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.LineItemsLeadValidationSettings,
        {
          lineItemId,
        },
      ),
      params: { leadValidationSettingId, ruleName },
    });
  } catch (error) {}
}
