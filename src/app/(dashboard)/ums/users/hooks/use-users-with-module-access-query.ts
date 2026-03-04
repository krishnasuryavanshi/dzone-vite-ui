import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchUsersWithModuleAccess } from '../services/fetch-users-with-module-access';

export function useUsersWithModuleAccessQuery(
  moduleName: string,
  tenantCode: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.users.withModuleAccess(moduleName, tenantCode),
    queryFn: () => fetchUsersWithModuleAccess(moduleName, tenantCode),
    staleTime: 5 * 60 * 1000,
    enabled: !!moduleName && !!tenantCode && enabled,
  });
}
