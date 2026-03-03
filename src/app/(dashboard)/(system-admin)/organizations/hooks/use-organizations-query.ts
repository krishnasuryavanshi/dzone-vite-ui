import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchOrganizations } from '../services';
import { Filters, Sorter } from '@/lib/utils/table';
import { IOrganization } from '../lib/types';

export function useOrganizationsQuery(
  page: number,
  size: number,
  filters?: Filters<IOrganization>,
  sorters?: Sorter<IOrganization>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.organizations.list({ page, size, filters, sorters }),
    queryFn: async () => {
      const result = await fetchOrganizations(page, size, filters, sorters);
      if (!result) throw new Error('Failed to fetch organizations');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
