import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchUsers } from '../services';

export function useUsersQuery(
  page: number,
  size: number,
  roleId?: string,
  username?: string,
  org?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.users.list({ page, size, roleId, username, org }),
    queryFn: async () => {
      const result = await fetchUsers(page, size, roleId, username, org);
      if (!result) throw new Error('Failed to fetch users');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
