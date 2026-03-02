import { BackendResources } from '@/lib/enums';
import { transformPath } from '@/lib/utils/string';
import { nextBackendRequest } from '@/services';
import { logError } from '@/services/logger';

export interface DeliveryLog {
  id: string;
  deliveryTemplateScheduleId: string;
  trackingId: string;
  status: 'SYNCED' | 'FAILED' | 'PENDING';
  message: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLogsResponse {
  data: DeliveryLog[];
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export interface FetchDeliveryLogsParams {
  scheduleId: string;
  page?: number;
  perPage?: number;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export const fetchDeliveryLogs = async (
  params: FetchDeliveryLogsParams,
): Promise<DeliveryLogsResponse | null> => {
  try {
    const { scheduleId, ...queryParams } = params;

    const response = await nextBackendRequest({
      resource: transformPath(BackendResources.LineItemDeliveryLogs, {
        scheduleId,
      }),
      params: queryParams,
    });

    return response;
  } catch (error) {
    logError(error);
    return null;
  }
};
