import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { createUser } from '../services';
import { showNotification } from '@/services/notification';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const result = await createUser(data);
      if (!result) throw new Error('Failed to create user');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      showNotification({ message: 'User created successfully' });
    },
  });
}
