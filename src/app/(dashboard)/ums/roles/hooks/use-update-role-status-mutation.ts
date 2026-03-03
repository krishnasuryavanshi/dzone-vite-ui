import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateRoleStatus } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateRoleStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const result = await updateRoleStatus(id, status);
      if (result?.isError) throw new Error('Failed to update role status');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      showNotification({ message: 'Role status updated successfully' });
    },
  });
}
