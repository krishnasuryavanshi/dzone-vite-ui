import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchRolesByType } from '../../roles/services/fetch-roles-by-type';

export function useRolesByTypeQuery(type: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.roles.byType(type),
    queryFn: () => fetchRolesByType(type),
    staleTime: 30 * 60 * 1000,
    enabled: !!type && enabled,
  });
}
