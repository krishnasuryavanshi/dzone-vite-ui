import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export async function fetchInitialActions() {
  try {
    return nextBackendRequest({
      resource: BackendResources.DzentInitialActions,
    });
  } catch (error) {}
}
