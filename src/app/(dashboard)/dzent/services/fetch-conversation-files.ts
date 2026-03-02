import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export async function fetchConversationFiles(id: string) {
  try {
    return nextBackendRequest({
      resource: BackendResources.DzentConversationFiles,
      params: { id },
    });
  } catch (error) {}
}
