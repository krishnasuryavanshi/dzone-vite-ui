import { formatDate } from '@/lib/utils';
import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';

const UNCHANGING_KEYS: (CampaignField | LineItemFields)[] = [
  CampaignField.Status,
  CampaignField.Id,
  CampaignField.CampaignId,
  CampaignField.MarketerCode,
  CampaignField.TenantCode,
  LineItemFields.LineItemId,
  LineItemFields.LineItemIdNumber,
  LineItemFields.CampaignIdNumber,
  LineItemFields.CampaignName,
  // LineItemFields.ClientIdNumber,
  // LineItemFields.ClientName,
  LineItemFields.Status,
]; // Keys that do not change and should be ignored in comparisons

export const isObjectModified = (
  updated: Record<string, any>,
  original?: Record<string, any>,
  dependencies?: Record<string, any>,
): boolean => {
  if (!original) {
    return Object.keys(updated).length > 0; // If no original data, any updated data implies a change
  }
  for (const key in updated) {
    if (UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields)) {
      continue;
    }

    const updatedValue = updated[key];
    const originalValue = original[key];

    if (originalValue === undefined || originalValue === null) {
      // If the original value is undefined or null, any updated value is considered a change
      if (updatedValue !== undefined && updatedValue !== null) {
        return true;
      }
    } else {
      // Compare values
      if (isDateKey(key)) {
        if (formatDate(originalValue) !== formatDate(updatedValue)) {
          return true;
        }
      } else if (typeof updatedValue === 'boolean' || typeof originalValue === 'boolean') {
        // Compare boolean values
        if (updatedValue !== originalValue) {
          return true;
        }
      } else {
        const originalStr = String(originalValue).trim().toLowerCase();
        const updatedStr = String(updatedValue).trim().toLowerCase();

        if (originalStr !== updatedStr) {
          return true;
        }
      }
    }
  }

  // Check for deletions: if there are keys in original that are not in updated
  for (const key in original) {
    if (!UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields) && !(key in updated)) {
      return true;
    }
  }

  return false;
};

// Define the type for date keys
const dateKeys: (CampaignField | LineItemFields)[] = [
  CampaignField.OpportunityCloseDate,
  CampaignField.TargetEndDate,
  CampaignField.TargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.TargetDeliveryStartDate,
];

// Update isDateKey function to ensure type consistency
const isDateKey = (key: string): boolean => {
  return dateKeys.includes(key as CampaignField | LineItemFields);
};
