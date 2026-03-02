import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchMarketersLeadValidationSetting(
  tenantCode: string,
  leadValidationSettingId: string,
): Promise<any> {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.MarketersLeadValidationSettings,
        {
          tenantCode,
        },
      ),
      params: { leadValidationSettingId },
    });
  } catch (error) {}
}
