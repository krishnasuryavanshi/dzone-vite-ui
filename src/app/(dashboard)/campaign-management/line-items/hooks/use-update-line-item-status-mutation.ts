import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateLineItemStatus } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateLineItemStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lineItemId, data }: { lineItemId: string; data: any }) =>
      updateLineItemStatus(lineItemId, data),
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
