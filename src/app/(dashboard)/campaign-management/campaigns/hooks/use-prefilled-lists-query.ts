import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { prefilledLists } from '../services';

export function usePrefilledListsQuery(userId?: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.campaigns.all, 'prefilledLists', userId],
    queryFn: () => prefilledLists(userId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
