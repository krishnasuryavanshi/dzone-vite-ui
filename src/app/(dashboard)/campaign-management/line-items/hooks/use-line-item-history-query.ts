import { useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLineItemHistory } from '../services/fetch-line-item-history';

const PAGE_SIZE = 10;

export function useLineItemHistoryInfiniteQuery(
  lineItemId: string,
  entityName = 'LineItemEntity',
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.lineItems.history(lineItemId),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await fetchLineItemHistory(lineItemId, {
        page: pageParam,
        size: PAGE_SIZE,
        entityName,
      });
      return result?.data ?? [];
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!lineItemId && enabled,
  });
}
