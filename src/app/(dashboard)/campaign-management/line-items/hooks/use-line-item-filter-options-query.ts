import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLineItemStatuses } from '../services';
import { fetchAssignedUsersInModule } from '@/app/(dashboard)/ums/users/services';

export function useLineItemFilterOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.lineItems.all, 'filterOptions'],
    queryFn: async () => {
      const [statuses, assignedUsers] = await Promise.all([
        fetchLineItemStatuses(),
        fetchAssignedUsersInModule('Line Item'),
      ]);
      return { statuses, assignedUsers };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
