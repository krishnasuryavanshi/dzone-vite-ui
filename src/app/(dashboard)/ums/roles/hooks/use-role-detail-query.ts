import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPermissionsByRoleId } from '../services';

export function useRoleDetailQuery(roleId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.roles.permissions(roleId ?? ''),
    queryFn: async () => {
      const result = await fetchPermissionsByRoleId(roleId!);
      if (!result) throw new Error('Failed to fetch role details');
      return result;
    },
    enabled: !!roleId,
  });
}
