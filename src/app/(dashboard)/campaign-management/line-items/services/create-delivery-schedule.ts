import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { DeliverySchedule } from './fetch-delivery-schedules';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

export interface CreateDeliverySchedulePayload {
  lineItemId: string;
  deliveryType: DeliveryType;
  deliveryFormat: 'CSV' | 'Excel' | null;
  deliveryTemplateId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime';
  deliveryDay: number | null;
  deliveryDate: number | null;
  deliveryTime: string | null;
}

export interface CreateDeliveryScheduleResponse {
  data: DeliverySchedule;
}

export const createDeliverySchedule = async (
  payload: CreateDeliverySchedulePayload,
): Promise<CreateDeliveryScheduleResponse | null> => {
  try {
    const data = await nextBackendRequest({
      resource: ApiResources.LineItemDeliverySchedules,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: payload as unknown as Record<string, unknown>,
    });
    return data;
  } catch (error) {
    logError(error);
    return null;
  }
};
