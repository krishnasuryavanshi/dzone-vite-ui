import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateOrganization } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
      organizationId,
    }: {
      data: Record<string, any>;
      organizationId: string;
    }) => updateOrganization(data, organizationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.organizations.lists() });
      showNotification({ message: 'Organization updated successfully' });
    },
  });
}
