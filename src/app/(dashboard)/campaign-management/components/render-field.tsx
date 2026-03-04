import { Checkbox, DatePicker, Input, InputNumber, TextArea } from '@/uicomponents/form/input';
import React from 'react';
import { renderSelect } from '../line-items/components/create-new-line-item/render-select';
import { PacingChartPreview } from '../line-items/components/create-new-line-item/pacing-chart';
import { DynamicFileUpload } from '@/components/shared/file-upload/file-upload-wrapper';
import { IPacingChartType } from '../line-items/lib/types';
import { FormInstance } from '@/uicomponents/form';
import dayjs from 'dayjs';
import { CampaignField } from '../campaigns/lib/enums';

export const renderField = (
  field: any,
  lists: Record<string, any[]>,
  form: FormInstance<any>,
  tenantCode?: string,
  initialFiles?: {
    assetFiles?: string[];
    deliveryTemplateFile?: Record<string, any>;
    ioFiles?: Record<string, any>;
  },
  pacingSchedule?: IPacingChartType[],
) => {
  const commonProps = {
    disabled: field.disabled || field.isReadOnly,
    placeholder: field.placeholder,
  };

  const assetFiles = initialFiles?.assetFiles;
  const deliveryTemplateFile = initialFiles?.deliveryTemplateFile;
  const ioFiles = initialFiles?.ioFiles;

  const handleUploadComplete = (data: any, field: any) => {
    form.setFieldValue(field, data);
  };
  switch (field.fieldType) {
    case 'text':
      return <Input className='input-field' style={{ height: '3rem' }} {...commonProps} />;
    case 'number':
      return <InputNumber className='input-field' style={{ width: '100%' }} {...commonProps} />;
    case 'textArea':
      return <TextArea className='input-field' {...commonProps} />;
    case 'multiselect':
      return renderSelect({
        field,
        mode: 'multiple',
        searchable: !!field.hasMultiselectSearch,
        options: lists[field.optionsKey] || [],
      });
    case 'searchableSelect':
      return renderSelect({
        field,
        searchable: true,
        options: lists[field.optionsKey] || [],
      });
    case 'select':
      return renderSelect({
        field,
        options: lists[field.optionsKey] || [],
      });
    case 'date':
      const fieldValue = form.getFieldValue(field.field);
      const validDate = fieldValue ? dayjs(fieldValue) : null;

      // Disable dates based on field type and related field values
      const disabledDate = (current: dayjs.Dayjs) => {
        const dateFields = [
          CampaignField.TargetStartDate,
          CampaignField.TargetEndDate,
          CampaignField.OpportunityCloseDate,
        ];

        // For target end date, disable dates before target start date
        if (field.field === CampaignField.TargetEndDate) {
          const targetStartDate = form.getFieldValue(CampaignField.TargetStartDate);
          if (targetStartDate) {
            // Disable dates before target start date
            return current && current.isBefore(dayjs(targetStartDate).startOf('day'));
          }
          // If no start date set, just disable past dates
          return current && current.isBefore(dayjs().startOf('day'));
        }

        // For target start date, disable dates after target end date if end date is set
        if (field.field === CampaignField.TargetStartDate) {
          const targetEndDate = form.getFieldValue(CampaignField.TargetEndDate);
          if (targetEndDate) {
            // Disable dates after target end date
            return (
              current &&
              (current.isBefore(dayjs().startOf('day')) ||
                current.isAfter(dayjs(targetEndDate).startOf('day')))
            );
          }
          // If no end date set, just disable past dates
          return current && current.isBefore(dayjs().startOf('day'));
        }

        // For other date fields, disable past dates
        if (dateFields.includes(field.field)) {
          return current && current.isBefore(dayjs().startOf('day'));
        }

        return false;
      };

      return (
        <DatePicker
          value={validDate && validDate.isValid() ? validDate : null}
          className='input-field'
          placeholder={field.placeholder}
          disabledDate={disabledDate}
          onChange={(date) => {
            if (date) {
              form.setFieldValue(field.field, date);
            } else {
              form.setFieldValue(field.field, null);
            }
          }}
          style={{ width: '100%' }}
        />
      );
    case 'checkbox': {
      const fieldValue = form.getFieldValue(field.field);
      return (
        <Checkbox
          checked={fieldValue}
          disabled={field.isReadOnly}
          onChange={(e) => form.setFieldValue(field.field, e.target.checked)}
        >
          {field.label}
        </Checkbox>
      );
    }
    case 'pacingChart':
      return (
        <PacingChartPreview
          pacingSchedule={field.pacingSchedule}
          customPacingData={field.customPacingData}
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
    case 'IOUpload':
      return (
        <DynamicFileUpload
          key={field.fileTypeName}
          fileTypeName={field.fileTypeName}
          uploadType='single'
          onUploadComplete={(data) => handleUploadComplete(data, field.field)}
          tenantCode={tenantCode}
          value={ioFiles}
        />
      );
    default:
      return null;
  }
};
