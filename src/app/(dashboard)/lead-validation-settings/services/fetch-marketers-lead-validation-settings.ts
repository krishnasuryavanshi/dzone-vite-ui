import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';

export async function fetchMarketersLeadValidationSettings(tenantCode: string) {
  try {
    return nextBackendRequest({
      resource: transformPath(
        BackendResources.MarketersLeadValidationSettings,
        {
          tenantCode,
        },
      ),
    });
  } catch (error) {}
}
