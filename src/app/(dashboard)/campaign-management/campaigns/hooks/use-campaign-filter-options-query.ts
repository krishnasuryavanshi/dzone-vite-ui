import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignStatuses } from '../services';
import { fetchAssignedUsersInModule } from '@/app/(dashboard)/ums/users/services';

export function useCampaignFilterOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.campaigns.all, 'filterOptions'],
    queryFn: async () => {
      const [statuses, assignedUsers] = await Promise.all([
        fetchCampaignStatuses(),
        fetchAssignedUsersInModule('Campaign'),
      ]);
      return { statuses, assignedUsers };
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
