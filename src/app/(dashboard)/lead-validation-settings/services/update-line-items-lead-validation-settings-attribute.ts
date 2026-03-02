import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function updateLineItemsLeadValidationSettingAttribute(
  lineItemId: string,
  leadValidationSettingId: string,
  attributeId: string,
  requestData: Record<string, any>,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.LineItemsLeadValidationSettingByAttribute,
        {
          lineItemId,
        },
      ),
      method: HttpMethod.PUT,
      data: { requestData, attributeId, leadValidationSettingId },
    });
  } catch (error) {}
}
