import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLineItem } from '../services';

export function useLineItemDetailQuery(lineItemId: string) {
  return useQuery({
    queryKey: queryKeys.lineItems.detail(lineItemId),
    queryFn: async () => {
      const result = await fetchLineItem(lineItemId);
      if (!result) throw new Error('Failed to fetch line item details');
      return result;
    },
    enabled: !!lineItemId,
  });
}
