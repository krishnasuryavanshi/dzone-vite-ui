import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFilterOptions } from '../services';

export function useLeadFilterOptionsQuery(url: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.leads.filterOptions(), url],
    queryFn: () => fetchFilterOptions(url),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!url && enabled,
  });
}
