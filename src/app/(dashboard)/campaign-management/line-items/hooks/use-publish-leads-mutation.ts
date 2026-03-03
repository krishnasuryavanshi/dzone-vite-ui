import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { publishLeads } from '../services';
import { showNotification } from '@/services/notification';

export function usePublishLeadsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishLeads,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      if (data?.message) {
        showNotification({ message: data.message });
      }
    },
  });
}
