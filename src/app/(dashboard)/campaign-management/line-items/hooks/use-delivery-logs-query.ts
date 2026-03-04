import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import {
  fetchDeliveryLogs,
  DeliveryLog,
  DeliveryLogsResponse,
} from '../services/fetch-delivery-logs';

interface DeliveryLogsFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
}

function applyFrontendFilters(logs: DeliveryLog[], filters: DeliveryLogsFilters): DeliveryLog[] {
  let filtered = logs;

  if (filters.status) {
    filtered = filtered.filter((log) => log.status === filters.status);
  }

  if (filters.startDate && filters.endDate) {
    const startDate = new Date(filters.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(filters.endDate);
    endDate.setHours(23, 59, 59, 999);

    filtered = filtered.filter((log) => {
      const createdAt = new Date(log.createdAt);
      const updatedAt = new Date(log.updatedAt);
      const createdInRange = createdAt >= startDate && createdAt <= endDate;
      const updatedInRange = updatedAt >= startDate && updatedAt <= endDate;
      return createdInRange || updatedInRange;
    });
  }

  return filtered;
}

export function useDeliveryLogsQuery(
  scheduleId: string | null,
  page: number,
  perPage: number,
  filters: DeliveryLogsFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.deliverySchedules.logs(scheduleId ?? '', { page, perPage, ...filters }),
    queryFn: async () => {
      const result = await fetchDeliveryLogs({
        scheduleId: scheduleId!,
        page,
        perPage,
        ...filters,
      });
      if (!result) throw new Error('Failed to fetch delivery logs');

      const hasFiltersApplied = filters.status || (filters.startDate && filters.endDate);
      const filteredLogs = applyFrontendFilters(result.data || [], filters);

      return {
        ...result,
        data: filteredLogs,
        total: hasFiltersApplied ? filteredLogs.length : result.total,
      } as DeliveryLogsResponse;
    },
    placeholderData: keepPreviousData,
    enabled: !!scheduleId && enabled,
  });
}
