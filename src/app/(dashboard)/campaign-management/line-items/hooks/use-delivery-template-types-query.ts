import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDeliveryTemplateTypes } from '../services/fetch-delivery-template-types';

export function useDeliveryTemplateTypesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.deliverySchedules.templateTypes(),
    queryFn: async () => {
      const result = await fetchDeliveryTemplateTypes();
      if (!result) throw new Error('Failed to fetch delivery template types');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    enabled,
  });
}
