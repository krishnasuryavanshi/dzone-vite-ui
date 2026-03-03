import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { saveRoleAndPermissions } from '../services/save-roles-and-permissions';
import { showNotification } from '@/services/notification';

export function useSaveRolePermissionsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveRoleAndPermissions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roles.lists() });
      showNotification({ message: 'Role permissions saved successfully' });
    },
  });
}
