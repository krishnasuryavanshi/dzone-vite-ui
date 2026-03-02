import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

export async function fetchLeadValidationSettingMetadata() {
  try {
    return nextBackendRequest({
      resource: ApiResources.LeadValidationSettingMetadata,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
