import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { transformPath } from '@/lib/utils/string';
import { authenticatedRequest } from '@/services/backend-request';
import { logError } from '@/services/logger';
import { convertUTCTimeToLocal } from '../lib/utils/convert-time-to-local';
import { DeliveryType } from '@/app/(dashboard)/integrations-hub/templates/lib/enums';

export interface DeliverySchedule {
  id: string;
  lineItemId: string;
  deliveryType: DeliveryType;
  deliveryFormat: 'CSV' | 'Excel' | null;
  deliveryTemplateId: string;
  deliveryTemplate: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'RealTime';
  deliveryDay: number | null; // 1-7 for Weekly (Monday-Sunday)
  deliveryDate: number | null; // 1-31 for Monthly
  deliveryTime: string | null; // Format: "2:45 PM"
  time: string | null;
  nextDelivery: string | null;
  leadCount: number;
  lastActivity: string;
  status: 'Active' | 'Paused' | 'Cancelled';
}

export interface DeliverySchedulesResponse {
  data: DeliverySchedule[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface FetchDeliverySchedulesResponse {
  data: DeliverySchedulesResponse;
  message: string;
}

export const fetchDeliverySchedules = async (
  lineItemId?: string,
): Promise<DeliverySchedulesResponse | null> => {
  try {
    const resource = lineItemId
      ? transformPath(ApiResources.LineItemDeliverySchedulesList, { lineItemId })
      : ApiResources.LineItemDeliverySchedules;
    const response = await authenticatedRequest({
      resource,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.GET,
    });

    // Convert deliveryTime from UTC to local timezone for each schedule
    if (response?.data && Array.isArray(response.data)) {
      response.data = response.data.map((schedule: DeliverySchedule) => ({
        ...schedule,
        deliveryTime: convertUTCTimeToLocal(schedule.deliveryTime),
      }));
    }

    return response;
  } catch (error) {
    logError(error);
    return null;
  }
};
