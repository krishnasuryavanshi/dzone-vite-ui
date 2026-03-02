import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export async function fetchLeadValidationSettingMetadata() {
  try {
    return nextBackendRequest({
      resource: BackendResources.LeadValidationSettingMetadata,
    });
  } catch (error) {}
}
