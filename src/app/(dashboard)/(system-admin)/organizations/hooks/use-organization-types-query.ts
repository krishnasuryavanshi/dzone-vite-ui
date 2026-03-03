import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchOrganizationType } from '../services';

export function useOrganizationTypesQuery() {
  return useQuery({
    queryKey: queryKeys.organizations.types(),
    queryFn: async () => {
      const result = await fetchOrganizationType();
      if (!result) throw new Error('Failed to fetch organization types');
      return result;
    },
    staleTime: 30 * 60 * 1000,
  });
}
