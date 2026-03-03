import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchUser } from '@/app/(dashboard)/ums/users/services';

export function useProfileQuery(userId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile.detail(userId),
    queryFn: async () => {
      const result = await fetchUser(userId);
      if (!result) throw new Error('Failed to fetch profile');
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!userId && enabled,
  });
}
