import { useQuery } from '@tanstack/react-query';
import { fetchPermissions } from '@/services/fetch-permissions';

export function usePermissionsQuery(roleIds: string[], enabled = true) {
  return useQuery({
    queryKey: ['permissions', roleIds],
    queryFn: () => fetchPermissions({ roleIds }),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: roleIds.length > 0 && enabled,
  });
}
