import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDeliveryTemplateList } from '../services/fetch-delivery-template-list';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

export function useDeliveryTemplateListQuery(
  deliveryType: DeliveryType,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.deliverySchedules.templateList(deliveryType),
    queryFn: async () => {
      const result = await fetchDeliveryTemplateList(deliveryType);
      if (!result) throw new Error('Failed to fetch delivery template list');
      return result;
    },
    enabled: !!deliveryType && enabled,
  });
}
