import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadDetailsById } from '../services';

export function useLeadDetailQuery(
  leadId: number,
  tenantCode?: string,
  enabled = true,
  options?: { refetchInterval?: number | false },
) {
  return useQuery({
    queryKey: queryKeys.leads.detail(leadId),
    queryFn: async () => {
      const result = await fetchLeadDetailsById(leadId, tenantCode);
      if (!result) throw new Error('Failed to fetch lead details');
      return result;
    },
    refetchInterval: options?.refetchInterval,
    enabled: !!leadId && enabled,
  });
}
