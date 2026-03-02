'use client';

import { BasicTable } from '@/components/table';
import { FormatDate } from '@/components/util';
import { TableProps } from '@/lib/types/uicomponents';
import { createColumn } from '@/lib/utils/table/create-columns';
import { Tag, Text, Spin } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { useDeliveryLogsStore } from './use-delivery-logs-store';
import { DeliveryLog } from '../../services/fetch-delivery-logs';
import styles from './delivery-logs-list.module.css';

interface DeliveryLogsListProps {
  scheduleId: string | null;
}

export const DeliveryLogsList = ({ scheduleId }: DeliveryLogsListProps) => {
  const { logs, isLoading } = useDeliveryLogsStore();

  if (!scheduleId) {
    return (
      <Flex justify='center' align='center' className={styles.noDataContainer}>
        <Text type='danger'>
          No schedule ID provided. Please select a delivery schedule.
        </Text>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex justify='center' align='center' className={styles.loadingContainer}>
        <Spin size='large' />
      </Flex>
    );
  }

  const trackingIdRenderer = (value: string) => <Text strong>{value}</Text>;

  const statusRenderer = (status: string) => {
    const color =
      status === 'SYNCED'
        ? 'success'
        : status === 'FAILED'
          ? 'error'
          : 'warning';
    return <Tag color={color}>{status}</Tag>;
  };

  const messageRenderer = (message: string) => {
    if (!message) return <Text>-</Text>;

    const isError =
      message.toLowerCase().includes('error') ||
      message.toLowerCase().includes('failed');
    return (
      <Text
        type={isError ? 'danger' : undefined}
        title={message}
        ellipsis={{ tooltip: true }}>
        {message}
      </Text>
    );
  };

  const retryCountRenderer = (count: number) => {
    const color = count === 0 ? 'success' : count < 3 ? 'warning' : 'error';
    return <Tag color={color}>{count}</Tag>;
  };

  const dateRenderer = (date: string) => {
    if (!date) return <Text>-</Text>;
    return <FormatDate date={date} />;
  };

  const column = createColumn(false);
  const columns: TableProps<DeliveryLog>['columns'] = [
    column(
      'Tracking ID',
      'trackingId',
      { width: 200, ellipsis: true },
      trackingIdRenderer,
    ),
    column('Status', 'status', { width: 120 }, statusRenderer),
    column(
      'Message',
      'message',
      { width: 300, ellipsis: true },
      messageRenderer,
    ),
    column('Retry Count', 'retryCount', { width: 120 }, retryCountRenderer),
    column('Created At', 'createdAt', { width: 180 }, dateRenderer),
    column('Updated At', 'updatedAt', { width: 180 }, dateRenderer),
  ];

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={logs}
      hasPagination={false}
    />
  );
};
