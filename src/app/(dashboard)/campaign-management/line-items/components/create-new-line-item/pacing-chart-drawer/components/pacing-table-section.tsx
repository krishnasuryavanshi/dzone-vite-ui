
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { Pacing } from '../../../../lib/enums/pacing.enum';
import dayjs from 'dayjs';
import { debounce } from 'lodash';

import type { MenuProps } from 'antd';
import { Flex } from '@/components/uicomponents/layout/flex';
import type { ColumnsType } from 'antd/es/table';
import type {
  PacingPeriod,
  ScheduleItem,
} from '../../../../services/fetch-pacing-schedule';
import { getDailySchedules, getFilteredPeriods } from '../utils';
import { LeadCountWarning } from '../lead-count-warning';
import styles from '../../pacing-chart-drawer.module.css';
import { Space } from '@/uicomponents/layout';
import { Checkbox, InputNumber } from '@/uicomponents/form';
import { Dropdown } from '@/uicomponents/dropdown';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  FilterFilled,
} from '@/uicomponents/icons';
import { Table } from '@/uicomponents/table';

interface PacingTableSectionProps {
  loading: boolean;
  pacingSchedule: string;
  targetLeadGoal: number;
  editedData: PacingPeriod[];
  hideZeroLeadCount: boolean;
  setHideZeroLeadCount: (value: boolean) => void;
  handleLeadsCountChange: (
    value: number | null | string,
    recordId: string,
    isParent?: boolean,
  ) => void;
  onAutoAdjust?: () => void;
  onPeriodAutoAdjust?: (periodId: string, targetTotal: number) => void;
  isReadOnly?: boolean;
  overflowDisabledPermanently?: boolean;
}

export const PacingTableSection: React.FC<PacingTableSectionProps> = ({
  loading,
  pacingSchedule,
  targetLeadGoal,
  editedData,
  hideZeroLeadCount,
  setHideZeroLeadCount,
  handleLeadsCountChange,
  onAutoAdjust,
  onPeriodAutoAdjust,
  isReadOnly = false,
  overflowDisabledPermanently = false,
}) => {
  // Track expanded row keys to prevent collapse on data update
  const [expandedRowKeys, setExpandedRowKeys] = React.useState<string[]>([]);

  // Create debounced version of handleLeadsCountChange
  const debouncedHandleLeadsCountChangeRef = useRef<any>(null);

  // Initialize debounced function
  useEffect(() => {
    debouncedHandleLeadsCountChangeRef.current = debounce(
      (value: number | null | string, recordId: string, isParent?: boolean) => {
        handleLeadsCountChange(value, recordId, isParent);
      },
      500, // 500ms delay
    );

    // Cleanup on unmount
    return () => {
      if (debouncedHandleLeadsCountChangeRef.current) {
        debouncedHandleLeadsCountChangeRef.current.cancel();
      }
    };
  }, [handleLeadsCountChange]);

  // Helper function to check if a date is in the past
  const isPastDate = useCallback((dateString: string) => {
    const today = dayjs().startOf('day');
    const checkDate = dayjs(dateString, 'YYYY-MM-DD').startOf('day');
    return checkDate.isBefore(today);
  }, []);

  // Helper function to check if a period contains past dates
  const containsPastDates = useCallback((period: PacingPeriod) => {
    // Check the period's pacing period date range
    if (period.pacingPeriod) {
      // Parse the date range from pacingPeriod string (e.g., "Jan 1 - Jan 7, 2024")
      const dateMatch = period.pacingPeriod.match(
        /(\w+\s+\d+)\s*-\s*(\w+\s+\d+),?\s*(\d{4})/,
      );
      if (dateMatch) {
        const endDateStr = `${dateMatch[2]}, ${dateMatch[3]}`;
        const endDate = dayjs(endDateStr, 'MMM D, YYYY').startOf('day');
        const today = dayjs().startOf('day');
        return endDate.isBefore(today);
      }
    }
    return false;
  }, []);
  const filterMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Space onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={hideZeroLeadCount}
            onChange={(e) => setHideZeroLeadCount(e.target.checked)}>
            Hide dates with &ldquo;0&rdquo; Lead Count
          </Checkbox>
        </Space>
      ),
    },
  ];

  const renderFilterHeader = () => (
    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
      <span>Leads Required</span>
      <Dropdown
        menu={{ items: filterMenuItems }}
        trigger={['click']}
        placement='bottomRight'>
        <FilterFilled
          style={{
            color: hideZeroLeadCount ? '#000000' : '#8c8c8c',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </Dropdown>
    </Space>
  );

  const getDailyColumns = useCallback((): ColumnsType<any> => {
    return [
      {
        title: 'Period',
        dataIndex: 'period',
        key: 'period',
        width: 100,
        render: (_, __, index) => index + 1,
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
        title: renderFilterHeader(),
        dataIndex: 'LeadsCount',
        key: 'LeadsCount',
        width: 150,
        render: (value, record) => {
          const isDisabled =
            isReadOnly ||
            isPastDate(record.date) ||
            overflowDisabledPermanently;
          return (
            <InputNumber
              value={value}
              min={0}
              onChange={(val) => {
                // Child row - don't pass isParent flag
                // Use debounced version to prevent rapid API calls
                if (debouncedHandleLeadsCountChangeRef.current) {
                  debouncedHandleLeadsCountChangeRef.current(
                    val,
                    record.id,
                    false,
                  );
                }
              }}
              style={{
                width: '120px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                ...(overflowDisabledPermanently
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : {}),
              }}
              disabled={isDisabled}
              title={
                overflowDisabledPermanently
                  ? 'Leads cannot be edited when overflow is enabled'
                  : isDisabled && !isReadOnly
                    ? 'Cannot edit past dates'
                    : undefined
              }
            />
          );
        },
      },
    ];
  }, [
    renderFilterHeader,
    handleLeadsCountChange,
    isReadOnly,
    isPastDate,
    overflowDisabledPermanently,
  ]);

  const getPeriodColumns = useCallback((): ColumnsType<PacingPeriod> => {
    return [
      {
        title: 'Period',
        dataIndex: 'period',
        key: 'period',
        width: 100,
      },
      {
        title: 'Pacing Period',
        key: 'pacingPeriod',
        dataIndex: 'pacingPeriod',
        width: 200,
      },
      {
        title: 'Days',
        dataIndex: 'days',
        key: 'days',
        width: 200,
        render: (days: string) => {
          // Display "N/A" instead of "NA" for Monthly pacing
          return pacingSchedule === Pacing.MONTHLY ? 'NA' : days;
        },
      },
      {
        title: renderFilterHeader(),
        dataIndex: 'LeadsCount',
        key: 'LeadsCount',
        width: 120,
        render: (value, record) => {
          const isDisabled =
            isReadOnly ||
            containsPastDates(record) ||
            overflowDisabledPermanently;
          return (
            <InputNumber
              value={value}
              min={0}
              onChange={(val) => {
                // Pass true as isParent flag for parent rows
                // Use debounced version to prevent rapid API calls
                if (debouncedHandleLeadsCountChangeRef.current) {
                  debouncedHandleLeadsCountChangeRef.current(
                    val,
                    record.id,
                    true,
                  );
                }
              }}
              onPressEnter={(e: any) => {
                // Handle Enter key - also mark as parent
                // On Enter, call immediately without debounce
                handleLeadsCountChange(e.target.value, record.id, true);
              }}
              style={{
                width: '120px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                ...(overflowDisabledPermanently
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : {}),
              }}
              disabled={isDisabled}
              title={
                overflowDisabledPermanently
                  ? 'Leads cannot be edited when overflow is enabled'
                  : isDisabled && !isReadOnly
                    ? 'Cannot edit past dates'
                    : undefined
              }
            />
          );
        },
      },
      {
        title: '',
        key: 'expand',
        width: 0,
      },
    ];
  }, [
    renderFilterHeader,
    handleLeadsCountChange,
    isReadOnly,
    containsPastDates,
    overflowDisabledPermanently,
    pacingSchedule,
  ]);

  const getExpandedColumns = useCallback((): ColumnsType<ScheduleItem> => {
    return [
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
        width: 250,
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
        render: (value, record) => {
          const isDisabled =
            isReadOnly ||
            isPastDate(record.date) ||
            overflowDisabledPermanently;
          return (
            <InputNumber
              value={value}
              min={0}
              onChange={(val) => {
                // Child row in expanded table - don't pass isParent flag
                handleLeadsCountChange(val, record.id, false);
              }}
              style={{
                width: '120px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                ...(overflowDisabledPermanently
                  ? { opacity: 0.6, cursor: 'not-allowed' }
                  : {}),
              }}
              disabled={isDisabled}
              title={
                overflowDisabledPermanently
                  ? 'Leads cannot be edited when overflow is enabled'
                  : isDisabled && !isReadOnly
                    ? 'Cannot edit past dates'
                    : undefined
              }
            />
          );
        },
      },
    ];
  }, [
    handleLeadsCountChange,
    isReadOnly,
    isPastDate,
    overflowDisabledPermanently,
  ]);

  const dailyData = useMemo(() => {
    return getDailySchedules(editedData, hideZeroLeadCount);
  }, [editedData, hideZeroLeadCount]);

  const filteredData = useMemo(() => {
    return getFilteredPeriods(editedData, hideZeroLeadCount);
  }, [editedData, hideZeroLeadCount]);

  if (
    loading ||
    pacingSchedule === Pacing.UNCAPPED ||
    !targetLeadGoal ||
    targetLeadGoal <= 0
  ) {
    return null;
  }

  return (
    <Flex vertical className={styles.tableSection}>
      {pacingSchedule === Pacing.DAILY && (
        <Table
          className={styles.pacingTable}
          columns={getDailyColumns()}
          dataSource={dailyData}
          rowKey='id'
          size='small'
          pagination={false}
          loading={loading}
        />
      )}

      {pacingSchedule !== Pacing.DAILY && (
        <Table<PacingPeriod>
          className={styles.pacingTable}
          columns={getPeriodColumns()}
          dataSource={filteredData}
          loading={false}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: (keys) => {
              setExpandedRowKeys(keys as string[]);
            },
            expandIconColumnIndex: 4, // Place expand icon in the last column
            expandedRowRender: (record) => {
              // Make sure we're using the latest data from record.schedules
              const childTableData = record.schedules
                .filter(
                  (schedule: any) =>
                    !hideZeroLeadCount || schedule.LeadsCount > 0,
                )
                .map((schedule: any, index: number) => ({
                  ...schedule,
                  period: index + 1,
                  LeadsCount: schedule.LeadsCount, // Explicitly include LeadsCount
                }));

              // Calculate the actual total from child schedules
              const weeklyTotal = record.schedules.reduce(
                (sum: number, schedule: ScheduleItem) =>
                  sum + (schedule.LeadsCount || 0),
                0,
              );
              // Parent's target value
              const weeklyTarget = record.LeadsCount;
              // Show warning when there's a mismatch between child total and parent target
              const showWeeklyWarning = weeklyTotal !== weeklyTarget;

              return (
                <Flex vertical>
                  <Table<ScheduleItem>
                    columns={getExpandedColumns()}
                    className={styles.expandedTable}
                    dataSource={childTableData}
                    rowKey={(item) => `${record.id}_${item.id}`}
                    pagination={false}
                    size='small'
                    loading={false}
                    showHeader={true}
                  />
                  {showWeeklyWarning && (
                    <LeadCountWarning
                      targetLeadGoal={weeklyTarget}
                      currentTotal={weeklyTotal}
                      onAutoAdjust={() => {
                        // Auto adjust the parent target to match child total
                        if (onPeriodAutoAdjust) {
                          onPeriodAutoAdjust(record.id, weeklyTotal);
                        }
                      }}
                      isChildTable={true}
                      pacingSchedule={pacingSchedule}
                    />
                  )}
                </Flex>
              );
            },
            expandedRowClassName: () => styles.expandedRow,
            rowExpandable: (record) =>
              record.schedules && record.schedules.length > 0,
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
      )}
    </Flex>
  );
};
