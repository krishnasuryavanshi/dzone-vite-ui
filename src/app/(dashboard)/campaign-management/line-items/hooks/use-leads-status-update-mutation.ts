import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { leadsStatusUpdate } from '../services';
import { showNotification } from '@/services/notification';

export function useLeadsStatusUpdateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      leadUpdates,
      tenantCode,
    }: {
      leadUpdates: Array<{ leadStatus: string; id: number }>;
      tenantCode?: string;
    }) => leadsStatusUpdate(leadUpdates, tenantCode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
