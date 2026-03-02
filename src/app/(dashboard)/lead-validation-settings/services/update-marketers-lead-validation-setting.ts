import { BackendResources, HttpMethod } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function updateMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
  requestData: Record<string, any>,
) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.MarketersLeadValidationSettings,
        {
          tenantCode,
        },
      ),
      method: HttpMethod.PUT,
      data: { requestData, leadValidationSettingId },
    });
  } catch (error) {}
}
