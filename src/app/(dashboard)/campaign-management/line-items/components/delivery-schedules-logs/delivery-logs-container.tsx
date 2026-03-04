import { useSearchParams } from '@/lib/hooks/use-router';
import { DeliveryLogsHeader } from './delivery-logs-header';
import { DeliveryLogsList } from './delivery-logs-list';
import { useDeliveryLogsStore } from './use-delivery-logs-store';
import { useDeliveryLogsQuery } from '../../hooks';
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
  const { filters, pagination, setPagination } = useDeliveryLogsStore();

  const { data: logsResponse, isLoading } = useDeliveryLogsQuery(
    scheduleId,
    pagination.currentPage,
    pagination.perPage,
    filters,
  );

  const logs = logsResponse?.data ?? [];
  const total = logsResponse?.total ?? 0;

  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination({
      currentPage: page,
      ...(pageSize && { perPage: pageSize }),
    });
  };

  return (
    <TableWithPaginationLayout
      header={<DeliveryLogsHeader scheduleId={scheduleId} lineItemId={lineItemId} />}
      table={<DeliveryLogsList scheduleId={scheduleId} logs={logs} isLoading={isLoading} />}
      pagination={
        <Hideable show={total > 0}>
          <SimplePagination
            current={pagination.currentPage}
            total={total}
            pageSize={pagination.perPage}
            onChange={handlePageChange}
          />
        </Hideable>
      }
    />
  );
};
