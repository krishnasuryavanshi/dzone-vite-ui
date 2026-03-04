import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchConversationFiles } from '../services/fetch-conversation-files';

export function useConversationFilesQuery(conversationId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dzent.conversationFiles(conversationId),
    queryFn: () => fetchConversationFiles(conversationId),
    enabled: !!conversationId && enabled,
  });
}
