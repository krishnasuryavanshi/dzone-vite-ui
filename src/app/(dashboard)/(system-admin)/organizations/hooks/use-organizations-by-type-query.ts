import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchOrganizationsByType } from '../services';

export function useOrganizationsByTypeQuery(type: string, userId?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.organizations.byType(type, userId),
    queryFn: () => fetchOrganizationsByType(type, userId),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!type && enabled,
  });
}
