import {
  Checkbox,
  Input,
  InputNumber,
  TextArea,
} from '@/uicomponents/form/input';
import React from 'react';
import { renderSelect } from './render-select';
import { PacingChartPreview } from './pacing-chart';
import { DynamicFileUpload } from '@/components/shared/file-upload/file-upload-wrapper';
import { PacingPeriod } from '../../services/fetch-pacing-schedule';
import { FormInstance } from '@/uicomponents/form';
import dayjs, { Dayjs } from 'dayjs';
import { DateFieldWithModal } from './date-field-with-modal';
import { LineItemFields } from '../../lib/enums';

export const renderField = (
  field: any,
  lists: Record<string, any[]>,
  pacingSchedule: string,
  form: FormInstance<any>,
  tenantCode?: string,
  initialFiles?: {
    assetFiles?: string[];
    deliveryTemplateFile?: Record<string, any>;
  },
  dateFieldRestrictions?: any,
  customPacingData?: PacingPeriod[],
  onPacingChange?: (value: string) => void,
  allFields?: any,
  lineItemId?: string,
  onPacingSave?: (data: any) => void,
  onPacingApiSave?: (changedData: any, id: string) => Promise<any>,
  originalData?: any,
  pacingDisabledPermanently?: boolean,
  overflowDisabledPermanently?: boolean,
) => {
  const commonProps = {
    disabled:
      field.isReadOnly ||
      (field.field === 'pacing' && pacingDisabledPermanently) ||
      (field.field === 'targetLeadGoal' && overflowDisabledPermanently),
    placeholder: field.placeholder,
  };

  const assetFiles = initialFiles?.assetFiles;
  const deliveryTemplateFile = initialFiles?.deliveryTemplateFile;
  const handleUploadComplete = (data: any, field: any) => {
    form.setFieldValue(field, data);
  };
  switch (field.fieldType) {
    case 'text':
      return (
        <Input
          className='input-field'
          style={{ height: '3rem' }}
          {...commonProps}
        />
      );
    case 'number':
      return (
        <InputNumber
          className='input-field'
          style={{ width: '100%' }}
          {...commonProps}
        />
      );
    case 'textArea':
      return <TextArea className='input-field' {...commonProps} />;
    case 'multiselect':
      return renderSelect({
        field,
        mode: 'multiple',
        searchable: !!field.hasMultiselectSearch,
        options: lists[field.optionsKey] || [],
        disabled: commonProps.disabled,
      });
    case 'searchableSelect':
      return renderSelect({
        field,
        searchable: true,
        options: lists[field.optionsKey] || [],
        disabled: commonProps.disabled,
      });
    case 'select':
      return renderSelect({
        field,
        options: lists[field.optionsKey] || [],
        onPacingChange: field.field === 'pacing' ? onPacingChange : undefined,
        disabled: commonProps.disabled,
      });
    case 'date':
      const fieldValue = form.getFieldValue(field.field);
      const validDate = fieldValue ? dayjs(fieldValue) : null;

      // Get date restrictions based on field type
      let disabledDate: ((current: Dayjs | null) => boolean) | undefined =
        undefined;
      let minDate: Dayjs = dayjs().startOf('day'); // Default: no past dates
      let maxDate: Dayjs | undefined = undefined;

      if (field.field === LineItemFields.TargetDeliveryStartDate) {
        // Target Delivery Start Date validations
        const targetStartDate = form.getFieldValue(
          LineItemFields.LineItemTargetStartDate,
        );

        const today = dayjs().startOf('day');

        // Rule: Target Delivery Start Date ≥ Target Start Date (mandatory)
        // Rule: No backdating - must be Today or future
        // Rule: Range 0-90 days from Target Start Date

        if (targetStartDate && dayjs(targetStartDate).isValid()) {
          const targetStartDayjs = dayjs(targetStartDate);
          // Minimum is the later of target start date or today
          minDate = targetStartDayjs.isAfter(today) ? targetStartDayjs : today;
          // Maximum is 90 days from target start date
          maxDate = targetStartDayjs.add(90, 'day');
        } else {
          // If no target start date, minimum is today
          minDate = today;
        }

        disabledDate = (current) => {
          if (!current) return false;
          // Disable past dates (no backdating)
          if (current.isBefore(today, 'day')) return true;
          // Disable dates before target start date
          if (
            targetStartDate &&
            current.isBefore(dayjs(targetStartDate), 'day')
          )
            return true;
          // Disable dates more than 90 days from target start date
          if (maxDate && current.isAfter(maxDate, 'day')) return true;
          return false;
        };
      } else if (field.field === LineItemFields.LineItemTargetStartDate) {
        // Target Start Date validations
        // Rule: No backdating - must be Today or future
        // Rule: Cannot edit after line item goes live
        const today = dayjs().startOf('day');

        disabledDate = (current) => {
          if (!current) return false;
          // Disable past dates (no backdating)
          return current.isBefore(today, 'day');
        };
      } else if (field.field === LineItemFields.LineItemTargetEndDate) {
        // Target End Date validations
        const targetStartDate = form.getFieldValue(
          LineItemFields.LineItemTargetStartDate,
        );
        const targetDeliveryStartDate = form.getFieldValue(
          LineItemFields.TargetDeliveryStartDate,
        );
        const today = dayjs().startOf('day');

        // Rule: Target Start Date < Target End Date (mandatory)
        // Rule: No backdating - must be Today or future
        // Rule: Can extend in future, but not advance to past after going live

        // Default minimum is today (no backdating)
        minDate = today;

        // If we have a target start date, end date must be after it
        if (targetStartDate && dayjs(targetStartDate).isValid()) {
          const targetStartDayjs = dayjs(targetStartDate);
          const dayAfterTargetStart = targetStartDayjs.add(1, 'day');
          // Use the later of today or day after target start date
          if (dayAfterTargetStart.isAfter(minDate)) {
            minDate = dayAfterTargetStart;
          }
        }

        // If we have a target delviery start date, end date must be after it
        if (
          targetDeliveryStartDate &&
          dayjs(targetDeliveryStartDate).isValid()
        ) {
          const targetDeliveryStartDayjs = dayjs(targetDeliveryStartDate);
          const dayAfterTargetStart = targetDeliveryStartDayjs.add(1, 'day');
          // Use the later of today or day after target start date
          if (dayAfterTargetStart.isAfter(minDate)) {
            minDate = dayAfterTargetStart;
          }
        }

        // Apply status-based restrictions for existing line items
        if (dateFieldRestrictions?.getMinTargetEndDate) {
          const restrictionMinDate =
            dateFieldRestrictions.getMinTargetEndDate();
          // Use the later of calculated minDate or restriction minDate
          if (restrictionMinDate && restrictionMinDate.isAfter(minDate)) {
            minDate = restrictionMinDate;
          }
        }

        disabledDate = (current) => {
          if (!current) return false;
          // Only disable dates before the calculated minimum date
          // This allows extending to future but prevents backdating
          return current.isBefore(minDate, 'day');
        };
      } else {
        // Default: no past dates
        disabledDate = (current) => {
          return current ? current.isBefore(dayjs().startOf('day')) : false;
        };
      }

      // Apply status-based restrictions based on line item status
      if (dateFieldRestrictions) {
        if (field.field === LineItemFields.TargetDeliveryStartDate) {
          const isFieldDisabled =
            !dateFieldRestrictions.canEditTargetDeliveryStartDate;
          commonProps.disabled = commonProps.disabled || isFieldDisabled;
        } else if (field.field === LineItemFields.LineItemTargetStartDate) {
          const isFieldDisabled = !dateFieldRestrictions.canEditTargetStartDate;
          commonProps.disabled = commonProps.disabled || isFieldDisabled;
        }
      } else {
        if (
          field.field === LineItemFields.TargetDeliveryStartDate ||
          field.field === 'lineItemTargetStartDate'
        ) {
        }
      }

      return (
        <DateFieldWithModal
          field={field}
          form={form}
          validDate={validDate}
          disabledDate={disabledDate}
          commonProps={commonProps}
        />
      );
    case 'checkbox': {
      const fieldValue = form.getFieldValue(field.field);
      return (
        <Checkbox
          checked={fieldValue}
          disabled={field.isReadOnly}
          onChange={(e) => form.setFieldValue(field.field, e.target.checked)}>
          {field.label}
        </Checkbox>
      );
    }
    case 'pacingChart':
      // Pass customPacingData for the chart preview and pacingSchedule for the type
      // Get additional values from form for preview
      const formValues = form.getFieldsValue();
      // Get checkbox values from form directly or from allFields
      const allowOverflowValue =
        form.getFieldValue('allowOverflow') ??
        allFields?.allowOverflow ??
        false;
      const deficitManagementValue =
        form.getFieldValue('deficitManagement') ??
        allFields?.deficitManagement ??
        false;
      const pacingType = form.getFieldValue('pacing') ?? allFields?.pacing;

      return (
        <PacingChartPreview
          customPacingData={customPacingData}
          pacingSchedule={pacingSchedule}
          pacing={pacingType}
          targetLeadGoal={formValues.targetLeadGoal}
          targetDeliveryStartDate={formValues.targetDeliveryStartDate}
          lineItemTargetStartDate={formValues.lineItemTargetStartDate}
          lineItemTargetEndDate={formValues.lineItemTargetEndDate}
          allowOverflow={allowOverflowValue}
          deficitManagement={deficitManagementValue}
          form={form}
          lineItemId={lineItemId}
          isViewMode={false} // This is for edit mode
          onSave={onPacingSave}
          onApiSave={onPacingApiSave}
          originalData={originalData}
          pacingScheduleOptions={lists?.pacingSchedules || []}
        />
      );
    case 'multipleFileUpload':
      return (
        <DynamicFileUpload
          key={field.fileTypeName}
          fileTypeName={field.fileTypeName}
          uploadType='multiple'
          onUploadComplete={(data) => handleUploadComplete(data, field.field)}
          tenantCode={tenantCode}
          value={assetFiles}
        />
      );
    case 'fileUpload':
      return (
        <DynamicFileUpload
          key={field.fileTypeName}
          fileTypeName={field.fileTypeName}
          uploadType='single'
          onUploadComplete={(data) => handleUploadComplete(data, field.field)}
          tenantCode={tenantCode}
          value={deliveryTemplateFile}
        />
      );
    default:
      return null;
  }
};
