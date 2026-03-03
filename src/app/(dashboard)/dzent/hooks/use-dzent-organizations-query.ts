import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';

export function useDzentOrganizationsQuery(
  type: string,
  userId?: string,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.dzent.organizations(type),
    queryFn: () => fetchOrganizationsByType(type, userId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!type && enabled,
  });
}
