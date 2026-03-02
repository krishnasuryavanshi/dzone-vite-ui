import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { Integration } from '../lib/types/integration';

interface UpdateIntegrationPayload {
  name: string;
  label: string;
  apiKey?: string;
  status?: string;
}

export const updateIntegration = async (
  id: string,
  payload: UpdateIntegrationPayload,
): Promise<Integration | null> => {
  try {
    const data = await nextBackendRequest({
      resource: `${ApiResources.Integrations}/${id}`,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.PUT,
      data: payload as unknown as Record<string, unknown>,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
