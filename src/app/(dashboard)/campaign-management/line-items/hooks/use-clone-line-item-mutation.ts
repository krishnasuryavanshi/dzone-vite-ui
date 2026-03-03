import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { cloneLineItem } from '../services';
import { showNotification } from '@/services/notification';

export function useCloneLineItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lineItemId, data }: { lineItemId: string; data: any }) =>
      cloneLineItem(lineItemId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lineItems.lists() });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
