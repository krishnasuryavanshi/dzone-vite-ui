import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchRolesList } from '../services';

export function useRolesListQuery(page: number, size: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.roles.list({ page, size }),
    queryFn: async () => {
      const result = await fetchRolesList(page, size);
      if (!result) throw new Error('Failed to fetch roles');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
