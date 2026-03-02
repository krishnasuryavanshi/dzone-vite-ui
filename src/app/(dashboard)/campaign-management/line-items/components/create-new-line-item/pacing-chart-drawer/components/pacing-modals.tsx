'use client';

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@/uicomponents/form/input';
import { Space } from '@/uicomponents/layout/space';
import { Text } from '@/components/uicomponents';
import { SwapRightOutlined } from '@/uicomponents/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Modal } from '@/uicomponents/modal';
import { showNotification } from '@/services/notification';

interface PacingModalsProps {
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  dateRange: [Dayjs, Dayjs] | null;
  handleDateRangeChange: (dates: any) => void;
  showBlockingAlert: boolean;
  setShowBlockingAlert: (show: boolean) => void;
  allocationDifference: number;
  targetLeadGoal: number;
  currentTotal: number;
  handleAutoAdjust: () => void;
  targetStartDate?: Dayjs | string | null;
  dateFieldRestrictions?: any;
  isEditMode?: boolean;
}

export const PacingModals: React.FC<PacingModalsProps> = ({
  showDatePicker,
  setShowDatePicker,
  dateRange,
  handleDateRangeChange,
  showBlockingAlert,
  setShowBlockingAlert,
  allocationDifference,
  targetLeadGoal,
  currentTotal,
  handleAutoAdjust,
  targetStartDate,
  dateFieldRestrictions,
  isEditMode = false,
}) => {
  // Local state to handle temporary date changes in the modal
  const [localDateRange, setLocalDateRange] = useState<[Dayjs, Dayjs] | null>(
    dateRange,
  );

  // Sync local state with parent state when modal opens
  useEffect(() => {
    if (showDatePicker) {
      setLocalDateRange(dateRange);
    }
  }, [showDatePicker, dateRange]);

  return (
    <>
      <Modal
        title='Select Pacing Period'
        open={showDatePicker}
        onCancel={() => {
          // Reset local state and close without saving
          setLocalDateRange(dateRange);
          setShowDatePicker(false);
        }}
        onOk={() => {
          if (localDateRange && localDateRange[0] && localDateRange[1]) {
            // Validation 1: Target End Date must be after Target Delivery Start Date
            if (
              localDateRange[1].isSame(localDateRange[0], 'day') ||
              localDateRange[1].isBefore(localDateRange[0], 'day')
            ) {
              showNotification({
                type: 'error',
                message:
                  'Invalid Date Range - Target End Date must be after Target Delivery Start Date.',
              });
              return;
            }

            // Validation 2: Check if Target Start Date exists and validate against it
            if (targetStartDate) {
              const targetStartDayjs =
                typeof targetStartDate === 'string'
                  ? dayjs(targetStartDate)
                  : targetStartDate;

              // Target Delivery Start Date cannot be before Target Start Date
              if (localDateRange[0].isBefore(targetStartDayjs, 'day')) {
                showNotification({
                  type: 'error',
                  message:
                    'Target Delivery Start Date cannot be before Target Start Date.',
                });
                return;
              }

              // Target End Date must be after Target Start Date
              if (
                localDateRange[1].isSame(targetStartDayjs, 'day') ||
                localDateRange[1].isBefore(targetStartDayjs, 'day')
              ) {
                showNotification({
                  type: 'error',
                  message: 'Target End Date must be after Target Start Date.',
                });
                return;
              }
            }

            handleDateRangeChange(localDateRange);
            setShowDatePicker(false);
          } else {
            showNotification({
              type: 'error',
              message: 'Please select both dates.',
            });
          }
        }}
        okText='Apply'
        cancelText='Cancel'>
        <Space direction='vertical' size='middle' style={{ width: '100%' }}>
          <Space
            direction='horizontal'
            size='small'
            style={{ width: '100%', alignItems: 'flex-end' }}>
            <Space direction='vertical' size='small' style={{ flex: 1 }}>
              <Text style={{ fontSize: '0.875rem', color: '#666' }}>
                Target Delivery Start Date
              </Text>
              <DatePicker
                value={localDateRange ? localDateRange[0] : null}
                onChange={(date) => {
                  if (date) {
                    const newRange: [Dayjs, Dayjs | null] = [
                      date,
                      localDateRange ? localDateRange[1] : null,
                    ];
                    setLocalDateRange(newRange as [Dayjs, Dayjs] | null);
                  }
                }}
                format='YYYY-MM-DD'
                style={{ width: '200px' }}
                placeholder='Target Delivery Start'
                disabled={
                  isEditMode &&
                  dateFieldRestrictions &&
                  !dateFieldRestrictions.canEditTargetDeliveryStartDate
                }
                disabledDate={(current) => {
                  if (!current) return false;

                  const today = dayjs().startOf('day');
                  // No backdating
                  if (current.isBefore(today, 'day')) return true;

                  // Must be within 0-90 days from Target Start Date
                  if (targetStartDate) {
                    const targetStart = dayjs(targetStartDate).startOf('day');
                    if (targetStart.isValid()) {
                      if (current.isBefore(targetStart, 'day')) return true;
                      const maxDate = targetStart.add(90, 'day');
                      if (current.isAfter(maxDate, 'day')) return true;
                    }
                  }

                  return false;
                }}
              />
            </Space>

            <SwapRightOutlined
              style={{
                color: '#999',
                alignSelf: 'center',
                marginTop: '1.5rem',
              }}
            />

            <Space direction='vertical' size='small' style={{ flex: 1 }}>
              <Text style={{ fontSize: '0.875rem', color: '#666' }}>
                Target End Date
              </Text>
              <DatePicker
                value={localDateRange ? localDateRange[1] : null}
                onChange={(date) => {
                  if (date) {
                    const newRange: [Dayjs | null, Dayjs] = [
                      localDateRange ? localDateRange[0] : null,
                      date,
                    ];
                    setLocalDateRange(newRange as [Dayjs, Dayjs] | null);
                  }
                }}
                format='YYYY-MM-DD'
                style={{ width: '200px' }}
                placeholder='Target End Date'
                disabled={
                  isEditMode &&
                  dateFieldRestrictions &&
                  !dateFieldRestrictions.canEditTargetEndDate
                }
                disabledDate={(current) => {
                  if (!current) return false;

                  const today = dayjs().startOf('day');
                  // No backdating
                  if (current.isBefore(today, 'day')) return true;

                  // Must be after Target Delivery Start Date
                  if (localDateRange && localDateRange[0]) {
                    if (
                      current.isSame(localDateRange[0], 'day') ||
                      current.isBefore(localDateRange[0], 'day')
                    ) {
                      return true;
                    }
                  }

                  // In edit mode, apply status-based restrictions
                  if (
                    isEditMode &&
                    dateFieldRestrictions?.getMinTargetEndDate
                  ) {
                    const minTargetEndDate =
                      dateFieldRestrictions.getMinTargetEndDate();
                    if (
                      minTargetEndDate &&
                      current.isBefore(minTargetEndDate, 'day')
                    ) {
                      return true;
                    }
                  }

                  // No upper limit for Target End Date
                  return false;
                }}
              />
            </Space>
          </Space>
        </Space>
      </Modal>
    </>
  );
};
