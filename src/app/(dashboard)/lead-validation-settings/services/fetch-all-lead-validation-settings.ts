import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export async function fetchAllLeadValidationSettings(
  page: number,
  size: number,
) {
  try {
    return nextBackendRequest({
      resource: BackendResources.LeadValidationSettings,
      params: { page, size },
    });
  } catch (error) {}
}
