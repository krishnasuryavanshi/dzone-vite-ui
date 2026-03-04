import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services';

export async function updateLineItemsLeadValidationSettingAttribute(
  lineItemId: string,
  leadValidationSettingId: string,
  attributeId: string,
  requestData: Record<string, any>,
) {
  try {
    return authenticatedRequest({
      resource: transformPath(ApiResources.LineItemsLeadValidationSettingByAttribute, {
        lineItemId,
        settingId: leadValidationSettingId,
        Id: attributeId,
      }),
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: requestData,
    });
  } catch (error) {}
}
