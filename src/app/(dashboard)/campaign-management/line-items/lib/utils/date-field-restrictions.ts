import { LineItemStatus } from '../enums/line-item-status.enum';
import { ILineItemStatus } from '../types';
import dayjs from 'dayjs';

/**
 * Statuses that allow editing of Target Start Date and Target Delivery Start Date
 */
const EDITABLE_STATUSES = [
  LineItemStatus.DRAFT,
  LineItemStatus.WAITING_TO_GO_LIVE,
  LineItemStatus.READY_FOR_LIVE,
];

/**
 * Check if the line item is in a status that allows editing date fields
 */
export const isLineItemEditableStatus = (
  status?: ILineItemStatus | string,
): boolean => {
  if (!status) return true; // New line items are always editable

  // Handle both ILineItemStatus object and string
  const statusValue =
    typeof status === 'object' && status !== null ? status.value : status;

  return EDITABLE_STATUSES.includes(statusValue as LineItemStatus);
};

/**
 * Get date field restrictions based on line item status
 */
export const getDateFieldRestrictions = (
  status?: ILineItemStatus | string,
  originalTargetEndDate?: string | Date | dayjs.Dayjs,
) => {
  const isEditable = isLineItemEditableStatus(status);
  const today = dayjs().startOf('day');

  return {
    // Target Start Date and Target Delivery Start Date
    // Can be edited only before going live (Draft, Waiting to go live, Ready for live)
    canEditTargetStartDate: isEditable,
    canEditTargetDeliveryStartDate: isEditable,

    // Target End Date can always be extended but not moved to past
    // If line item has gone live, it can only be extended beyond the original date
    canEditTargetEndDate: true,

    // Get minimum allowed date for Target End Date
    getMinTargetEndDate: () => {
      if (!isEditable && originalTargetEndDate) {
        // After going live, can only extend (not advance to past)
        const originalDate = dayjs(originalTargetEndDate);
        // Return the later of today or the original date
        return originalDate.isAfter(today) ? originalDate : today;
      }
      // Before going live or for new items, minimum is today
      return today;
    },
  };
};

/**
 * Validate if a new Target End Date is allowed based on status and original date
 */
export const isValidTargetEndDate = (
  newDate: string | Date | dayjs.Dayjs,
  originalDate?: string | Date | dayjs.Dayjs,
  status?: ILineItemStatus | string,
): boolean => {
  const newDateDayjs = dayjs(newDate);

  // Must be a valid date
  if (!newDateDayjs.isValid()) return false;

  // Cannot be in the past
  const today = dayjs().startOf('day');
  if (newDateDayjs.isBefore(today, 'day')) return false;

  // If line item has gone live
  if (!isLineItemEditableStatus(status) && originalDate) {
    const originalDateDayjs = dayjs(originalDate);
    // Can only extend, not move to earlier date
    if (newDateDayjs.isBefore(originalDateDayjs, 'day')) {
      return false;
    }
  }

  return true;
};

/**
 * Get validation error messages for date fields
 */
export const getDateValidationMessage = (
  fieldName: 'targetStartDate' | 'targetEndDate' | 'targetDeliveryStartDate',
  status?: ILineItemStatus | string,
  originalDate?: string | Date | dayjs.Dayjs,
): string => {
  const isEditable = isLineItemEditableStatus(status);

  switch (fieldName) {
    case 'targetStartDate':
      if (!isEditable) {
        return 'Target Start Date cannot be changed after the line item goes live';
      }
      return 'Target Start Date cannot be in the past';

    case 'targetDeliveryStartDate':
      if (!isEditable) {
        return 'Target Delivery Start Date cannot be changed after the line item goes live';
      }
      return 'Target Delivery Start Date cannot be in the past';

    case 'targetEndDate':
      if (!isEditable && originalDate) {
        const originalDateFormatted = dayjs(originalDate).format('DD MMM YYYY');
        return `Target End Date can only be extended beyond ${originalDateFormatted}`;
      }
      return 'Target End Date cannot be in the past';

    default:
      return 'Invalid date';
  }
};
