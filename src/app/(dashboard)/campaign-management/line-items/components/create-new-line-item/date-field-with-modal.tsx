import React, { useState } from 'react';
import { DatePicker } from '@/uicomponents/form/input';
import { FormInstance } from '@/uicomponents/form';
import dayjs, { Dayjs } from 'dayjs';
import { TargetDateExtensionModal } from './target-date-extension-modal';
import { LineItemFields } from '../../lib/enums';

interface DateFieldWithModalProps {
  field: any;
  form: FormInstance<any>;
  validDate: Dayjs | null;
  disabledDate: ((current: Dayjs | null) => boolean) | undefined;
  commonProps: any;
}

export const DateFieldWithModal: React.FC<DateFieldWithModalProps> = ({
  field,
  form,
  validDate,
  disabledDate,
  commonProps,
}) => {
  const [modalState, setModalState] = useState<{
    open: boolean;
    currentStartDate: string;
    currentDeliveryDate: string;
    newStartDate: string;
    suggestedDeliveryDate: string;
    pendingDate: Dayjs | null;
    isExtensionModal: boolean; // Track if this is the special Target Start Date extension modal
    fieldLabel: string; // For generic date change confirmations
  }>({
    open: false,
    currentStartDate: '',
    currentDeliveryDate: '',
    newStartDate: '',
    suggestedDeliveryDate: '',
    pendingDate: null,
    isExtensionModal: false,
    fieldLabel: '',
  });

  return (
    <>
      <DatePicker
        value={validDate && validDate.isValid() ? validDate : null}
        className='input-field'
        disabledDate={disabledDate}
        onChange={(rawDate) => {
          const date = Array.isArray(rawDate) ? rawDate[0] : rawDate;
          if (!date) {
            // If date is cleared, apply immediately
            form.setFieldValue(field.field, null);
            return;
          }

          // Don't apply the change immediately - store it as pending and show modal
          const currentValue = form.getFieldValue(field.field);
          const currentDate = currentValue && dayjs(currentValue).isValid() ? currentValue : null;

          // Special handling for Target Start Date changes that affect Target Delivery Start Date
          if (field.field === LineItemFields.LineItemTargetStartDate) {
            const currentTargetDeliveryStartDate = form.getFieldValue(
              LineItemFields.TargetDeliveryStartDate,
            );

            // If Target Delivery Start Date was manually set and new Target Start Date is after it
            if (
              currentTargetDeliveryStartDate &&
              dayjs(currentTargetDeliveryStartDate).isValid() &&
              date.isAfter(dayjs(currentTargetDeliveryStartDate))
            ) {
              // Show the extension modal for date conflicts
              const newDeliveryStartDate = date.add(7, 'day');
              setModalState({
                open: true,
                currentStartDate: currentDate
                  ? dayjs(currentDate).format('DD MMM YYYY')
                  : 'Not set',
                currentDeliveryDate: dayjs(currentTargetDeliveryStartDate).format('DD MMM YYYY'),
                newStartDate: date.format('DD MMM YYYY'),
                suggestedDeliveryDate: newDeliveryStartDate.format('DD MMM YYYY'),
                pendingDate: date,
                isExtensionModal: true,
                fieldLabel: 'Target Start Date',
              });
              return;
            } else if (!currentTargetDeliveryStartDate) {
              // For new items without delivery date, set directly without modal
              const newDeliveryStartDate = date.add(7, 'day');
              form.setFieldValue(LineItemFields.LineItemTargetStartDate, date);
              form.setFieldValue(LineItemFields.TargetDeliveryStartDate, newDeliveryStartDate);
              form.setFields([
                { name: LineItemFields.LineItemTargetStartDate, errors: [] },
                { name: LineItemFields.TargetDeliveryStartDate, errors: [] },
              ]);
              return;
            }
          }

          // For Target End Date, check if it's after Target Delivery Start Date
          if (field.field === LineItemFields.LineItemTargetEndDate) {
            const targetDeliveryStartDate = form.getFieldValue(
              LineItemFields.TargetDeliveryStartDate,
            );

            if (targetDeliveryStartDate && dayjs(targetDeliveryStartDate).isValid()) {
              const deliveryDate = dayjs(targetDeliveryStartDate);

              // Check if Target End Date is same or before Target Delivery Start Date
              if (date.isSame(deliveryDate, 'day') || date.isBefore(deliveryDate, 'day')) {
                form.setFieldValue(field.field, date);
                form.setFields([
                  {
                    name: field.field,
                    errors: ['Target End Date must be after Target Delivery Start Date'],
                  },
                ]);
                return;
              }
            }
          }

          // For Target Delivery Start Date, check if it's before Target End Date
          if (field.field === LineItemFields.TargetDeliveryStartDate) {
            const targetEndDate = form.getFieldValue(LineItemFields.LineItemTargetEndDate);

            if (targetEndDate && dayjs(targetEndDate).isValid()) {
              const endDate = dayjs(targetEndDate);

              // Check if Target Delivery Start Date is same or after Target End Date
              if (date.isSame(endDate, 'day') || date.isAfter(endDate, 'day')) {
                form.setFieldValue(field.field, date);
                form.setFields([
                  {
                    name: LineItemFields.LineItemTargetEndDate,
                    errors: ['Target End Date must be after Target Delivery Start Date'],
                  },
                ]);
                return;
              }
            }
          }

          // For all other date fields or valid dates, apply changes directly
          form.setFieldValue(field.field, date);
          form.setFields([{ name: field.field, errors: [] }]);

          // Clear related field errors if dates are now valid
          if (field.field === LineItemFields.TargetDeliveryStartDate) {
            const targetEndDate = form.getFieldValue(LineItemFields.LineItemTargetEndDate);
            if (
              targetEndDate &&
              dayjs(targetEndDate).isValid() &&
              date.isBefore(dayjs(targetEndDate), 'day')
            ) {
              form.setFields([{ name: LineItemFields.LineItemTargetEndDate, errors: [] }]);
            }
          }

          if (field.field === LineItemFields.LineItemTargetEndDate) {
            const targetDeliveryStartDate = form.getFieldValue(
              LineItemFields.TargetDeliveryStartDate,
            );
            if (
              targetDeliveryStartDate &&
              dayjs(targetDeliveryStartDate).isValid() &&
              date.isAfter(dayjs(targetDeliveryStartDate), 'day')
            ) {
              form.setFields([{ name: LineItemFields.LineItemTargetEndDate, errors: [] }]);
            }
          }
        }}
        style={{ width: '100%' }}
        {...commonProps}
      />
      <TargetDateExtensionModal
        open={modalState.open}
        currentStartDate={modalState.currentStartDate}
        currentDeliveryDate={modalState.currentDeliveryDate}
        newStartDate={modalState.newStartDate}
        suggestedDeliveryDate={modalState.suggestedDeliveryDate}
        onConfirm={() => {
          if (modalState.pendingDate) {
            if (modalState.isExtensionModal) {
              // Handle Target Start Date extension with delivery date update
              const newDeliveryStartDate = modalState.pendingDate.add(7, 'day');
              form.setFieldValue(LineItemFields.LineItemTargetStartDate, modalState.pendingDate);
              form.setFieldValue(LineItemFields.TargetDeliveryStartDate, newDeliveryStartDate);

              // Check if the new start date invalidates the end date
              const currentTargetEndDate = form.getFieldValue(LineItemFields.LineItemTargetEndDate);
              if (currentTargetEndDate && dayjs(currentTargetEndDate).isValid()) {
                if (
                  modalState.pendingDate.isAfter(dayjs(currentTargetEndDate), 'day') ||
                  modalState.pendingDate.isSame(dayjs(currentTargetEndDate), 'day')
                ) {
                  form.setFields([
                    {
                      name: LineItemFields.LineItemTargetStartDate,
                      errors: [],
                    },
                    {
                      name: LineItemFields.TargetDeliveryStartDate,
                      errors: [],
                    },
                    {
                      name: LineItemFields.LineItemTargetEndDate,
                      errors: ['Target End Date must be after Target Start Date'],
                    },
                  ]);
                } else {
                  // Clear validation errors for the date fields
                  form.setFields([
                    {
                      name: LineItemFields.LineItemTargetStartDate,
                      errors: [],
                    },
                    {
                      name: LineItemFields.TargetDeliveryStartDate,
                      errors: [],
                    },
                    { name: LineItemFields.LineItemTargetEndDate, errors: [] },
                  ]);
                }
              } else {
                // Clear validation errors for the date fields
                form.setFields([
                  { name: LineItemFields.LineItemTargetStartDate, errors: [] },
                  { name: LineItemFields.TargetDeliveryStartDate, errors: [] },
                ]);
              }
            } else {
              // Handle simple date change confirmation for other fields
              form.setFieldValue(field.field, modalState.pendingDate);
              form.setFields([{ name: field.field, errors: [] }]);
            }
          }
          setModalState({
            open: false,
            currentStartDate: '',
            currentDeliveryDate: '',
            newStartDate: '',
            suggestedDeliveryDate: '',
            pendingDate: null,
            isExtensionModal: false,
            fieldLabel: '',
          });
        }}
        onCancel={() => {
          // For both extension modal and simple confirmations, just close without applying any changes
          // "Keep Current Dates" and X button should not change any field values
          setModalState({
            open: false,
            currentStartDate: '',
            currentDeliveryDate: '',
            newStartDate: '',
            suggestedDeliveryDate: '',
            pendingDate: null,
            isExtensionModal: false,
            fieldLabel: '',
          });
        }}
      />
    </>
  );
};
