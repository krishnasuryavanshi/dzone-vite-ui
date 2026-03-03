import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLineItems } from '../services';
import { Filters } from '@/lib/utils/table';
import { ILineItem } from '../lib/types';

export function useLineItemsQuery(
  page: number,
  size: number,
  campaignId?: string,
  filters?: Filters<ILineItem>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.lineItems.list({ page, size, campaignId, filters }),
    queryFn: async () => {
      const result = await fetchLineItems(page, size, campaignId, filters);
      if (!result) throw new Error('Failed to fetch line items');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
