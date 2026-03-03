import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string/transform-path';
import {
  ConversationMetadata,
  ChatHistoryMessage,
  ChatHistoryAttachment,
  ConversationFilterType,
} from '../lib/types';

// Re-export types for backward compatibility
export type { ChatHistoryAttachment, ChatHistoryMessage };

export interface ChatHistoryResponse {
  messages: ChatHistoryMessage[];
  total: number;
  page: number;
  pageSize: number;
}

export const fetchConversationList = async (
  filter: ConversationFilterType = 'current',
  tenantCode?: string,
): Promise<ConversationMetadata[]> => {
  try {
    const params: Record<string, string> = {};

    // Only pass tenantCode when filter is 'current' and tenantCode is provided
    if (filter === 'current' && tenantCode) {
      params.tenantCode = tenantCode;
    }
    // When filter is 'all', don't pass tenantCode to get all conversations

    const data = await authenticatedRequest({
      resource: ApiResources.CoworkerConversations,
      apiHost: ApiHost.AICoworkerService,
      method: HttpMethod.GET,
      params: Object.keys(params).length > 0 ? params : undefined,
    });
    return data || [];
  } catch (error) {
    logError(error);
    return [];
  }
};

export const fetchChatHistory = async (
  conversationId: string,
  page: number = 0,
  pageSize: number = 50,
): Promise<ChatHistoryResponse | null> => {
  try {
    const resource = transformPath(ApiResources.CoworkerChatHistory, {
      conversationId,
    });

    const data = await authenticatedRequest({
      resource,
      apiHost: ApiHost.AICoworkerService,
      method: HttpMethod.GET,
      params: { page, pageSize },
    });

    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
