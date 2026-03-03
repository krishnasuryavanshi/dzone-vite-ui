import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { createLineItem } from '../services';
import { showNotification } from '@/services/notification';

export function useCreateLineItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => createLineItem(data) as Promise<any>,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lineItems.lists() });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
