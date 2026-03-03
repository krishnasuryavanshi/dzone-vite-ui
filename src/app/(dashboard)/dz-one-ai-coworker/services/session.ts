import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';

export interface SessionInitResponse {
  success: boolean;
  sessionId: string | null;
  conversationId: string | null;
  hasAccess: boolean;
  expiresIn: number;
  history: unknown[];
  error: string | null;
}

export const initSession = async (
  tenantCode: string,
  conversationId?: string,
): Promise<SessionInitResponse> => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.CoworkerSessionInit,
      apiHost: ApiHost.AICoworkerService,
      method: HttpMethod.POST,
      data: { tenantCode, conversationId },
    });
    return data;
  } catch (error) {
    logError(error);
    // Return error response instead of null
    return {
      success: false,
      sessionId: null,
      conversationId: null,
      hasAccess: false,
      expiresIn: 0,
      history: [],
      error: 'Failed to initialize session. Please try again.',
    };
  }
};
