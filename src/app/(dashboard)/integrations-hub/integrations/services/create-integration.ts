import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { Integration } from '../lib/types/integration';

interface CreateIntegrationPayload {
  name: string;
  label: string;
  apiKey: string;
  type: string;
}

export const createIntegration = async (
  payload: CreateIntegrationPayload,
): Promise<Integration | null> => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.Integrations,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: payload as unknown as Record<string, unknown>,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
