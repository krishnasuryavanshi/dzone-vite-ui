import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { createDeliverySchedule, CreateDeliverySchedulePayload } from '../services';
import { showNotification } from '@/services/notification';

export function useCreateDeliveryScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDeliverySchedulePayload) => createDeliverySchedule(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.deliverySchedules.list(variables.lineItemId),
      });
      showNotification({ message: 'Delivery schedule created successfully' });
    },
  });
}
