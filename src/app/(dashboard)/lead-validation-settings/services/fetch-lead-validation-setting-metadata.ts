import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services';

export async function fetchLeadValidationSettingMetadata() {
  try {
    return authenticatedRequest({
      resource: ApiResources.LeadValidationSettingMetadata,
      apiHost: ApiHost.PlatformService,
    });
  } catch (error) {}
}
