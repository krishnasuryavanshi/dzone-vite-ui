import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
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
    const data = await nextBackendRequest({
      resource: BackendResources.Integrations,
      method: HttpMethod.POST,
      data: payload as unknown as Record<string, unknown>,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
