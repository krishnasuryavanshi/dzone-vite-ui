import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDeliverySchedules } from '../services';

export function useDeliverySchedulesQuery(lineItemId?: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.deliverySchedules.list(lineItemId),
    queryFn: async () => {
      const result = await fetchDeliverySchedules(lineItemId);
      if (!result) throw new Error('Failed to fetch delivery schedules');
      return result;
    },
    enabled: !!lineItemId && enabled,
  });
}
