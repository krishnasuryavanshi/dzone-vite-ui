import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchLineItemsLeadValidationSetting(
  lineItemId: string,
  leadValidationSettingId: string,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.LineItemsLeadValidationSettings,
        {
          lineItemId,
        },
      ),
      params: { leadValidationSettingId },
    });
  } catch (error) {}
}
