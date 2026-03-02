import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function updateLineItemsLeadValidationSettingRule(
  lineItemId: string,
  leadValidationSettingId: string,
  ruleName: string,
  requestData: Record<string, any>,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.LineItemsLeadValidationSettings,
        {
          lineItemId,
        },
      ),
      method: HttpMethod.PATCH,
      data: { requestData, ruleName, leadValidationSettingId },
    });
  } catch (error) {}
}
