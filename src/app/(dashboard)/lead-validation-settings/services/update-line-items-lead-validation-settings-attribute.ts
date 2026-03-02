import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
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
        ApiResources.LineItemsLeadValidationSettingByAttribute,
        {
          lineItemId,
          settingId: leadValidationSettingId,
          Id: attributeId,
        },
      ),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: requestData,
    });
  } catch (error) {}
}
