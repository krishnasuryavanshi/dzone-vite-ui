import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { returnLeads } from '../services';
import { showNotification } from '@/services/notification';

export function useReturnLeadsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lineItemId,
      leadIds,
      returnReasons,
    }: {
      lineItemId: string;
      leadIds: number[];
      returnReasons: string[];
    }) => returnLeads(lineItemId, leadIds, returnReasons),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
