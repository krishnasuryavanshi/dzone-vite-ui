import React from 'react';
import { Table } from '@/uicomponents/table';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents';
import { CaretDownOutlined, CaretUpOutlined } from '@/uicomponents/icons';
import type { ColumnsType } from 'antd/es/table';
import styles from '@/app/(dashboard)/campaign-management/line-items/components/create-new-line-item/pacing-chart-drawer.module.css';

interface PacingPeriod {
  id: string;
  period: number;
  pacingPeriod: string;
  days: string;
  LeadsCount: number;
  schedules?: ScheduleItem[];
}

interface ScheduleItem {
  id: string;
  period: number;
  date: string;
  day: string;
  LeadsCount: number;
}

interface ReadonlyPacingTableProps {
  data: PacingPeriod[];
  pacingSchedule: string;
}

export const ReadonlyPacingTable: React.FC<ReadonlyPacingTableProps> = ({
  data,
  pacingSchedule,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<string[]>([]);

  const getDailyColumns = (): ColumnsType<ScheduleItem> => [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      width: 200,
    },
    {
      title: 'Leads Required',
      dataIndex: 'LeadsCount',
      key: 'LeadsCount',
      width: 150,
      render: (value) => <>{value || 0}</>,
    },
  ];

  const getExpandedColumns = (): ColumnsType<ScheduleItem> => [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 150,
    },
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
      width: 200,
    },
    {
      title: 'Lead Required',
      dataIndex: 'LeadsCount',
      key: 'LeadsCount',
      width: 200,
      render: (value) => <>{value || 0}</>,
    },
  ];

  const getPeriodColumns = (): ColumnsType<PacingPeriod> => [
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      width: 100,
    },
    {
      title: 'Pacing Period',
      dataIndex: 'pacingPeriod',
      key: 'pacingPeriod',
      width: 200,
    },
    {
      title: 'Days',
      dataIndex: 'days',
      key: 'days',
      width: 200,
      render: (days: string) => {
        return pacingSchedule === 'MONTHLY' ? 'NA' : days;
      },
    },
    {
      title: 'Leads Required',
      dataIndex: 'LeadsCount',
      key: 'LeadsCount',
      width: 120,
      render: (value) => <>{value || 0}</>,
    },
    {
      title: '',
      key: 'expand',
      width: 0,
    },
  ];

  const expandedRowRender = (record: PacingPeriod) => {
    if (!record.schedules || record.schedules.length === 0) return null;

    const childTableData = record.schedules.map((schedule: any, index: number) => ({
      ...schedule,
      period: index + 1,
    }));

    return (
      <Flex vertical>
        <Table<ScheduleItem>
          columns={getExpandedColumns()}
          className={styles.expandedTable}
          dataSource={childTableData}
          rowKey={(item) => `${record.id}_${item.id}`}
          pagination={false}
          size='small'
          showHeader={true}
        />
      </Flex>
    );
  };

  // For daily pacing, show flat table
  if (pacingSchedule === 'Daily' && data[0] && !data[0].schedules) {
    return (
      <Table<ScheduleItem>
        className={styles.pacingTable}
        columns={getDailyColumns()}
        dataSource={data as any}
        rowKey='id'
        size='small'
        pagination={false}
      />
    );
  }

  // For other pacing types with expandable rows
  return (
    <Table<PacingPeriod>
      className={styles.pacingTable}
      columns={getPeriodColumns()}
      dataSource={data}
      expandable={{
        expandedRowKeys,
        onExpandedRowsChange: (keys) => {
          setExpandedRowKeys(keys as string[]);
        },
        expandIconColumnIndex: 4,
        expandedRowRender,
        expandedRowClassName: () => styles.expandedRow,
        rowExpandable: (record) => !!(record.schedules && record.schedules.length > 0),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretUpOutlined
              onClick={(e) => onExpand(record, e)}
              style={{ cursor: 'pointer', fontSize: '12px' }}
            />
          ) : (
            <CaretDownOutlined
              onClick={(e) => onExpand(record, e)}
              style={{ cursor: 'pointer', fontSize: '12px' }}
            />
          ),
      }}
      rowKey='id'
      pagination={false}
      size='small'
    />
  );
};
