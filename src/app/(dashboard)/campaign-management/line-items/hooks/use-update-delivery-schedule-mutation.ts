import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { updateDeliverySchedule, UpdateDeliverySchedulePayload } from '../services';
import { showNotification } from '@/services/notification';

export function useUpdateDeliveryScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateDeliverySchedulePayload;
      lineItemId?: string;
    }) => updateDeliverySchedule(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.deliverySchedules.list(variables.lineItemId),
      });
      showNotification({ message: 'Delivery schedule updated successfully' });
    },
  });
}
