import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export async function fetchAllLeadValidationSettings(
  page: number,
  size: number,
) {
  try {
    return nextBackendRequest({
      resource: ApiResources.LeadValidationSettings,
      apiHost: ApiHost.PlatformService,
      params: { page, size },
    });
  } catch (error) {}
}
