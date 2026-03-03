import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateUser } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, userId }: { data: Record<string, any>; userId: string }) =>
      updateUser(data, userId),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showNotification({ message: 'User updated successfully' });
    },
  });
}
