import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { putCreateCampaign } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateCampaignMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, campaignId }: { data: any; campaignId: string }) =>
      putCreateCampaign(data, campaignId),
    onSuccess: (_data, { campaignId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(campaignId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.lists(),
      });
      showNotification({ message: 'Campaign updated successfully' });
    },
  });
}
