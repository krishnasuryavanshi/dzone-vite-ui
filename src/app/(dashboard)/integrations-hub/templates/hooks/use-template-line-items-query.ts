import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLineItems } from '../services';

export function useTemplateLineItemsQuery(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.templates.all, 'lineItems'],
    queryFn: () => fetchLineItems(),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
