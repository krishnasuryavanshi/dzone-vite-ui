import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchOrganization } from '../services';

export function useOrganizationDetailQuery(orgId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(orgId),
    queryFn: async () => {
      const result = await fetchOrganization(orgId);
      if (!result) throw new Error('Failed to fetch organization details');
      return result;
    },
    enabled: !!orgId && enabled,
  });
}
