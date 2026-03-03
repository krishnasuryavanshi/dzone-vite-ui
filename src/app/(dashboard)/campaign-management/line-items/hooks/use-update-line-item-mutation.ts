import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateLineItem } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateLineItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, lineItemId }: { data: any; lineItemId: string }) =>
      updateLineItem(data, lineItemId) as Promise<any>,
    onSuccess: (data, { lineItemId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.lineItems.detail(lineItemId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.lineItems.lists(),
      });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
