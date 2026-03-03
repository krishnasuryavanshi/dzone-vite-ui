import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDeliveryTemplatesByMarketer } from '@/app/(dashboard)/integrations-hub/templates/services';

export function useDeliveryTemplatesByMarketerQuery(
  marketerCode?: string,
  lineItemId?: string,
) {
  return useQuery({
    queryKey: queryKeys.templates.byMarketer(marketerCode!, lineItemId),
    queryFn: () => fetchDeliveryTemplatesByMarketer(marketerCode!, lineItemId),
    enabled: !!marketerCode,
  });
}
