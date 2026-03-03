import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchConversations } from '../services';

export function useConversationsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dzent.conversations(),
    queryFn: async () => {
      const result = await fetchConversations();
      if (!result) throw new Error('Failed to fetch conversations');
      return result;
    },
    enabled,
  });
}
