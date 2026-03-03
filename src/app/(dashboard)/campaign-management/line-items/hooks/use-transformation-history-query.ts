import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchTransformationHistory } from '../services/transformation-history';

export function useTransformationHistoryQuery(
  lineItemId: string,
  page: number,
  size: number,
) {
  return useQuery({
    queryKey: queryKeys.transformHistory.list(lineItemId, { page, size }),
    queryFn: () => fetchTransformationHistory(lineItemId, page, size),
    placeholderData: keepPreviousData,
    enabled: !!lineItemId,
  });
}
