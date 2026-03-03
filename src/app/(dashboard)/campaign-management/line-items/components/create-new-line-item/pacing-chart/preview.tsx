
import { Tooltip, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import './preview.scss';
import { IPacingChartType } from '../../../lib/types';
import { PacingPeriod } from '../../../services/fetch-pacing-schedule';
import { PacingChartDrawer } from '../pacing-chart-drawer';
import { PacingType } from '../../../lib/enums/pacing-type.enum';
import { formatDate } from '@/lib/utils';
import { fetchPacingSchedule } from '../../../services/fetch-pacing-schedule';
import { showNotification } from '@/services/notification';
import dayjs from 'dayjs';

interface IPacingChartPreviewProps {
  pacingSchedule?: string;
  pacing?: string;
  customPacingData?: PacingPeriod[];
  targetLeadGoal?: number;
  targetDeliveryStartDate?: string;
  lineItemTargetStartDate?: string;
  lineItemTargetEndDate?: string;
  allowOverflow?: boolean;
  deficitManagement?: boolean;
  form?: any;
  lineItemId?: string;
  isViewMode?: boolean;
  onSave?: (data: any) => void;
  onApiSave?: (changedData: any, id: string) => Promise<any>;
  originalData?: any;
  pacingScheduleOptions?: Array<{ value: string; label: string }>;
}
export const PacingChartPreview: React.FC<IPacingChartPreviewProps> = ({
  pacingSchedule,
  pacing,
  customPacingData,
  targetLeadGoal,
  targetDeliveryStartDate,
  lineItemTargetStartDate,
  lineItemTargetEndDate,
  allowOverflow,
  deficitManagement,
  form,
  lineItemId,
  isViewMode = false,
  onSave,
  onApiSave,
  originalData,
  pacingScheduleOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [updatedPacingData, setUpdatedPacingData] = useState<
    PacingPeriod[] | null
  >(null);

  // Always show preview button in all modes
  const shouldShowPreview = true;

  // Determine if drawer should be in preview-only mode:
  // - In create mode (no lineItemId), always preview-only
  // - In view mode, always preview-only
  // - When pacing is "No Pacing", always preview-only (nothing to edit)
  // Otherwise, allow editing when lineItemId exists
  const isPreviewOnly =
    !lineItemId || isViewMode || pacing === PacingType.NO_PACING;

  // Trigger API call with updated data when opening in edit mode
  const handleButtonClick = async (e: React.MouseEvent) => {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();

    // Validate fields before opening drawer
    if (form) {
      // Get current form values
      const currentValues = {
        targetLeadGoal: form.getFieldValue('targetLeadGoal'),
        lineItemTargetStartDate: form.getFieldValue('lineItemTargetStartDate'),
        lineItemTargetEndDate: form.getFieldValue('lineItemTargetEndDate'),
        targetDeliveryStartDate: form.getFieldValue('targetDeliveryStartDate'),
      };

      // Check for required fields
      if (!currentValues.targetLeadGoal || currentValues.targetLeadGoal <= 0) {
        showNotification({
          type: 'error',
          message:
            'Please enter a valid Target Lead Goal before viewing pacing',
        });
        return;
      }

      if (!currentValues.lineItemTargetStartDate) {
        showNotification({
          type: 'error',
          message: 'Please enter Target Start Date before viewing pacing',
        });
        return;
      }

      if (!currentValues.lineItemTargetEndDate) {
        showNotification({
          type: 'error',
          message: 'Please enter Target End Date before viewing pacing',
        });
        return;
      }

      if (!currentValues.targetDeliveryStartDate) {
        showNotification({
          type: 'error',
          message:
            'Please enter Target Delivery Start Date before viewing pacing',
        });
        return;
      }

      // Validate date relationships
      const targetStartDate = dayjs(currentValues.lineItemTargetStartDate);
      const targetEndDate = dayjs(currentValues.lineItemTargetEndDate);
      const targetDeliveryStartDate = dayjs(
        currentValues.targetDeliveryStartDate,
      );

      // Check if dates are valid
      if (
        !targetStartDate.isValid() ||
        !targetEndDate.isValid() ||
        !targetDeliveryStartDate.isValid()
      ) {
        showNotification({
          type: 'error',
          message: 'Please enter valid dates before viewing pacing',
        });
        return;
      }

      // Check Target End Date vs Target Start Date
      if (
        targetEndDate.isSame(targetStartDate, 'day') ||
        targetEndDate.isBefore(targetStartDate, 'day')
      ) {
        showNotification({
          type: 'error',
          message: 'Target End Date must be after Target Start Date',
        });
        return;
      }

      // Check Target End Date vs Target Delivery Start Date
      if (
        targetEndDate.isSame(targetDeliveryStartDate, 'day') ||
        targetEndDate.isBefore(targetDeliveryStartDate, 'day')
      ) {
        showNotification({
          type: 'error',
          message: 'Target End Date must be after Target Delivery Start Date',
        });
        return;
      }

      // Check Target Delivery Start Date vs Target Start Date
      if (targetDeliveryStartDate.isBefore(targetStartDate, 'day')) {
        showNotification({
          type: 'error',
          message:
            'Target Delivery Start Date cannot be before Target Start Date',
        });
        return;
      }

      // Check if field errors exist
      const fieldErrors = form.getFieldsError();
      const hasErrors = fieldErrors.some(
        (field: any) => field.errors && field.errors.length > 0,
      );
      if (hasErrors) {
        showNotification({
          type: 'error',
          message: 'Please fix all field errors before viewing pacing',
        });
        return;
      }
    }

    // Open the drawer after validation passes
    setOpen(true);

    // In edit mode with existing pacing, fetch updated pacing schedule
    // Skip API call if allowOverflow is true (pacing can't be updated anyway)
    if (
      lineItemId &&
      !isViewMode &&
      pacing === PacingType.CUSTOM_PACING &&
      pacingSchedule &&
      !allowOverflow // Don't call API if overflow is allowed
    ) {
      // Get current form values
      const currentValues = {
        targetLeadGoal: form?.getFieldValue('targetLeadGoal'),
        lineItemTargetStartDate: form?.getFieldValue('lineItemTargetStartDate'),
        lineItemTargetEndDate: form?.getFieldValue('lineItemTargetEndDate'),
        targetDeliveryStartDate: form?.getFieldValue('targetDeliveryStartDate'),
      };

      // Format original dates for comparison
      const originalValues = {
        targetLeadGoal: originalData?.targetLeadGoal,
        lineItemTargetStartDate: originalData?.lineItemTargetStartDate,
        lineItemTargetEndDate: originalData?.lineItemTargetEndDate,
        targetDeliveryStartDate: originalData?.targetDeliveryStartDate,
      };

      // Check if any of these fields have changed from original
      const hasFieldsChanged =
        originalData &&
        (currentValues.targetLeadGoal !== originalValues.targetLeadGoal ||
          formatDate(currentValues.lineItemTargetStartDate) !==
            formatDate(originalValues.lineItemTargetStartDate) ||
          formatDate(currentValues.lineItemTargetEndDate) !==
            formatDate(originalValues.lineItemTargetEndDate) ||
          formatDate(currentValues.targetDeliveryStartDate) !==
            formatDate(originalValues.targetDeliveryStartDate));

      // If fields have changed, fetch updated pacing schedule
      if (hasFieldsChanged) {
        // Run API call in background without waiting
        Promise.resolve().then(async () => {
          try {
            // Call fetchPacingSchedule API to get updated pacing strategy
            const updatedSchedule = await fetchPacingSchedule({
              lineItemId: lineItemId,
              lineItemTargetStartDate:
                formatDate(currentValues.lineItemTargetStartDate) || '',
              targetDeliveryStartDate:
                formatDate(currentValues.targetDeliveryStartDate) || '',
              lineItemTargetEndDate:
                formatDate(currentValues.lineItemTargetEndDate) || '',
              targetLeadGoal: Number(currentValues.targetLeadGoal) || 0,
              pacingSchedule: pacingSchedule,
              pacing: pacing,
              allowOverflow: allowOverflow || false,
              deficitManagement: deficitManagement !== false, // Default true
            });

            if (updatedSchedule) {
              // Update the pacing data to be used in the drawer
              setUpdatedPacingData(updatedSchedule);

              // Also update the form with the new data
              if (form) {
                form.setFieldValue('customPacingData', updatedSchedule);
              }
            }
          } catch (error) {
            // Silently handle error
          }
        });
      }
    }
  };

  // Don't render anything if conditions not met
  if (!shouldShowPreview) {
    return null;
  }

  return (
    <>
      <Tooltip
        overlayClassName='white-arrow-tooltip'
        overlayStyle={{
          whiteSpace: 'wrap',
          background: 'white',
          maxWidth: '12.5rem',
        }}
        overlayInnerStyle={{
          fontSize: '0.875rem',
          textAlign: 'center',
          color: '#000',
          background: '#fff',
        }}
        title={'Edit/Preview Pacing Chart'}
        placement='right'>
        <Button
          type='default'
          icon={<EyeOutlined />}
          style={{
            marginTop: '2.2rem',
            border: `1px solid ${DZONE_CLR_BLACK}`,
            borderRadius: '4px',
          }}
          onClick={handleButtonClick}>
          View/Edit Pacing
        </Button>
      </Tooltip>
      <PacingChartDrawer
        lineItemId={lineItemId}
        open={open}
        onClose={() => {
          setOpen(false);
          // Clear updated pacing data when closing
          setUpdatedPacingData(null);
        }}
        pacing={pacing}
        pacingSchedule={pacingSchedule}
        customPacingData={updatedPacingData || customPacingData} // Use updated data if available
        targetLeadGoal={targetLeadGoal}
        targetDeliveryStartDate={targetDeliveryStartDate}
        lineItemTargetStartDate={lineItemTargetStartDate} // For preview, align start date with target delivery start date
        lineItemTargetEndDate={lineItemTargetEndDate}
        isPreviewMode={isPreviewOnly} // Use calculated preview mode
        form={form}
        allowOverflow={allowOverflow}
        deficitManagement={deficitManagement}
        onSave={onSave}
        onApiSave={onApiSave} // Use original handler which already handles reload
        originalData={originalData}
        pacingScheduleOptions={pacingScheduleOptions}
      />
    </>
  );
};
