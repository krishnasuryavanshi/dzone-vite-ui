import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { postCreateCampaign } from '../services';
import { showNotification } from '@/services/notification';

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCreateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
      showNotification({ message: 'Campaign created successfully' });
    },
  });
}
