import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { transformPath } from '@/lib/utils/string';
import { DeliverySchedule } from './fetch-delivery-schedules';
import { CreateDeliverySchedulePayload } from './create-delivery-schedule';

export type UpdateDeliverySchedulePayload =
  | Partial<CreateDeliverySchedulePayload>
  | { status: 'Active' | 'Paused' | 'Cancelled' };

export const updateDeliverySchedule = async (
  id: string,
  payload: UpdateDeliverySchedulePayload,
): Promise<DeliverySchedule | null> => {
  try {
    const data = await nextBackendRequest({
      resource: transformPath(BackendResources.LineItemDeliveryScheduleById, {
        scheduleId: id,
      }),
      method: HttpMethod.PUT,
      data: payload as unknown as Record<string, unknown>,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};

export const updateDeliveryScheduleStatus = async (
  id: string,
  status: 'Active' | 'Paused' | 'Cancelled',
): Promise<DeliverySchedule | null> => {
  return updateDeliverySchedule(id, { status });
};
