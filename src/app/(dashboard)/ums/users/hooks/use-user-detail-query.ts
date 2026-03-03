import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchUser } from '../services';

export function useUserDetailQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: async () => {
      const result = await fetchUser(userId);
      if (!result) throw new Error('Failed to fetch user details');
      return result;
    },
    enabled: !!userId && enabled,
  });
}
