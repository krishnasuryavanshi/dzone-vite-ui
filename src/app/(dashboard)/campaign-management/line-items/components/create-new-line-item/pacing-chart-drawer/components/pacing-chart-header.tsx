import React from 'react';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Flex } from '@/components/uicomponents/layout/flex';
import { Hideable } from '@/components/shared';
import { Pacing } from '../../../../lib/enums/pacing.enum';
import { HeaderConfiguration } from '../header-configuration';
import type { Dayjs } from 'dayjs';
import { Spin } from '@/uicomponents/spin';
import { Alert } from '@/uicomponents/alert';
import styles from '../../pacing-chart-drawer.module.css';

interface PacingChartHeaderProps {
  hasBeenLive: boolean;
  dateRange: [Dayjs, Dayjs] | null;
  pacingSchedule: string;
  setPacingSchedule: (value: string) => void;
  pacingScheduleOptions: Array<{ value: string; label: string }>;
  allowOverflow: boolean;
  setallowOverflow: (value: boolean) => void;
  deficitManagement: boolean;
  setdeficitManagement: (value: boolean) => void;
  pacing?: string;
  onPacingChange?: (pacing: string) => void;
  onDateClick: () => void;
  loading: boolean;
  targetLeadGoal: number;
  fetchPacingData: (forceFetch?: boolean, overrides?: any) => void;
  clearEditedData?: () => void;
  originalPacingValue?: string | null; // Add original pacing value for confirmation logic
  isPreviewMode?: boolean;
  lineItemStatus?: string;
  lineItemId?: string;
  overflowDisabledPermanently?: boolean;
  onOverflowEnable?: () => void;
}

export const PacingChartHeader: React.FC<PacingChartHeaderProps> = ({
  hasBeenLive,
  dateRange,
  pacingSchedule,
  setPacingSchedule,
  pacingScheduleOptions,
  allowOverflow,
  setallowOverflow,
  deficitManagement,
  setdeficitManagement,
  pacing,
  onPacingChange,
  onDateClick,
  loading,
  targetLeadGoal,
  fetchPacingData,
  clearEditedData,
  originalPacingValue,
  isPreviewMode = false,
  lineItemStatus,
  lineItemId,
  overflowDisabledPermanently = false,
  onOverflowEnable,
}) => {
  return (
    <Flex vertical>
      <HeaderConfiguration
        dateRange={dateRange}
        pacingSchedule={pacingSchedule}
        originalPacingValue={originalPacingValue}
        setPacingSchedule={(value) => {
          if (!isPreviewMode) {
            setPacingSchedule(value);
            // Only fetch data if a valid pacing schedule is selected (not cleared)
            if (dateRange && targetLeadGoal > 0 && value && value !== '') {
              // Use a small delay to prevent rapid API calls if user is quickly changing options
              setTimeout(() => {
                fetchPacingData(true, { pacingSchedule: value });
              }, 300);
            } else if (!value || value === '') {
              // Clear data immediately when pacing schedule is cleared
              clearEditedData?.();
            }
          }
        }}
        pacingScheduleOptions={pacingScheduleOptions}
        allowOverflow={allowOverflow}
        setallowOverflow={(value) => {
          if (!isPreviewMode) {
            setallowOverflow(value);
            // Don't fetch pacing data when changing overflow setting
          }
        }}
        deficitManagement={deficitManagement}
        setdeficitManagement={(value) => {
          if (!isPreviewMode) {
            setdeficitManagement(value);
            // Don't fetch pacing data when changing deficit management setting
          }
        }}
        pacing={pacing}
        onPacingChange={onPacingChange}
        onDateClick={onDateClick}
        isReadOnly={isPreviewMode && !!lineItemId}
        hasBeenLive={hasBeenLive}
        lineItemId={lineItemId}
        overflowDisabledPermanently={overflowDisabledPermanently}
        onOverflowEnable={onOverflowEnable}
      />

      <Hideable show={loading}>
        <Spin
          style={{ marginTop: '6.25rem' }}
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
      </Hideable>

      {!loading && pacingSchedule === Pacing.UNCAPPED && (
        <Alert
          message='Uncapped Pacing'
          description='No lead delivery restrictions. Suppliers can deliver leads without any daily, weekly, or monthly caps.'
          type='info'
          showIcon
          icon={<InfoCircleOutlined />}
          className={styles.uncappedAlert}
        />
      )}

      {!loading &&
        pacingSchedule !== Pacing.UNCAPPED &&
        (!targetLeadGoal || targetLeadGoal <= 0) && (
          <Alert
            message='Target Lead Goal Required'
            description='Please set a target lead goal in the basic details section to configure pacing schedule.'
            type='warning'
            showIcon
            icon={<InfoCircleOutlined />}
            className={styles.compactWarningAlert}
          />
        )}
    </Flex>
  );
};
