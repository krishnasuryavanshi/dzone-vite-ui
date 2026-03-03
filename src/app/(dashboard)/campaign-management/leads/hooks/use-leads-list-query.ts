import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadsList } from '../services';

export function useLeadsListQuery(
  page: number,
  size: number,
  tenantCode?: string,
  lineItemId?: string | null,
  extraParams?: Record<string, any>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.leads.list({ page, size, tenantCode, lineItemId, ...extraParams }),
    queryFn: async () => {
      const result = await fetchLeadsList(page, size, tenantCode, lineItemId, extraParams || {});
      if (!result) throw new Error('Failed to fetch leads');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
