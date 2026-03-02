'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { DeliveryLogsHeader } from './delivery-logs-header';
import { DeliveryLogsList } from './delivery-logs-list';
import { useDeliveryLogsStore } from './use-delivery-logs-store';
import { TableWithPaginationLayout, Hideable } from '@/components/shared';
import { SimplePagination } from '@/uicomponents';

interface DeliveryLogsContainerProps {
  lineItemId: string;
  sessionTenantCode?: string[];
}

export const DeliveryLogsContainer = ({
  lineItemId,
  sessionTenantCode,
}: DeliveryLogsContainerProps) => {
  const searchParams = useSearchParams();
  const scheduleId = searchParams.get('scheduleId');
  const { fetchLogs, resetFilters, pagination, setPagination } =
    useDeliveryLogsStore();

  useEffect(() => {
    if (scheduleId) {
      resetFilters();
      fetchLogs(scheduleId);
    }
  }, [scheduleId, resetFilters, fetchLogs]);

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      currentPage: page,
      ...(pageSize && { perPage: pageSize }),
    });
    if (scheduleId) {
      fetchLogs(scheduleId);
    }
  };

  return (
    <TableWithPaginationLayout
      header={
        <DeliveryLogsHeader scheduleId={scheduleId} lineItemId={lineItemId} />
      }
      table={<DeliveryLogsList scheduleId={scheduleId} />}
      pagination={
        <Hideable show={pagination.total > 0}>
          <SimplePagination
            current={pagination.currentPage}
            total={pagination.total}
            pageSize={pagination.perPage}
            onChange={handlePageChange}
          />
        </Hideable>
      }
    />
  );
};
