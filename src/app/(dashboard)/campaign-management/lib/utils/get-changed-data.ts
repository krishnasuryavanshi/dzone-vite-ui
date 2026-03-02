import isEqual from 'lodash/isEqual';
import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';
import { formatDate } from '@/lib/utils';
import {
  UNCHANGING_KEYS,
  FILE_KEYS,
  dateKeys,
} from './keys-required-for-changed-data';

export const getChangedData = (
  currentData: Record<string, any>,
  previousData: Record<string, any>,
) => {
  const changedData: Record<string, any> = {};

  for (const key in currentData) {
    if (key in previousData) {
      // Skip comparison for keys that do not change
      if (UNCHANGING_KEYS.includes(key as CampaignField | LineItemFields)) {
        continue;
      }

      // Special handling for FILE_KEYS
      if (FILE_KEYS.includes(key as CampaignField | LineItemFields)) {
        if (!isEqual(currentData[key], previousData[key]?.id)) {
          changedData[key] = currentData[key];
        }
      } else if (isDateKey(key)) {
        // Handle date fields
        const originalValue = previousData[key];
        const updatedValue = currentData[key];
        if (formatDate(originalValue) !== formatDate(updatedValue)) {
          changedData[key] = currentData[key];
        }
      } else if (
        typeof currentData[key] === 'object' &&
        typeof previousData[key] === 'object'
      ) {
        // Compare objects by their `id` if they have an `id` property
        if (currentData[key]?.id && previousData[key]?.id) {
          if (currentData[key].id !== previousData[key].id) {
            changedData[key] = currentData[key];
          }
        } else if (!isEqual(currentData[key], previousData[key])) {
          changedData[key] = currentData[key];
        }
      } else if (
        isObjectFieldWithValue(currentData[key]) ||
        isObjectFieldWithValue(previousData[key])
      ) {
        // Special handling for fields that might be objects with value/name properties
        // This handles cases like: {value: "Custom Pacing", name: "Custom Pacing"} vs "Custom Pacing"
        const extractFieldValue = (val: any) => {
          if (!val) return '';
          if (typeof val === 'string') return val.trim();
          if (typeof val === 'object' && (val.value || val.name)) {
            return (val.value || val.name).trim();
          }
          return val.toString().trim();
        };

        const currentFieldValue = extractFieldValue(currentData[key]);
        const previousFieldValue = extractFieldValue(previousData[key]);

        if (currentFieldValue !== previousFieldValue) {
          changedData[key] = currentData[key];
        }
      } else if (!isEqual(currentData[key], previousData[key])) {
        changedData[key] = currentData[key];
      }
    } else {
      // If the key is not present in previousData, it is considered a new field or change
      changedData[key] = currentData[key];
    }
  }

  return Object.fromEntries(Object.entries(changedData));
};

// Update isDateKey function to ensure type consistency
const isDateKey = (key: string): boolean => {
  return dateKeys.includes(key as CampaignField | LineItemFields);
};

// Helper function to detect if a field might be an object with value/name properties
const isObjectFieldWithValue = (value: any): boolean => {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    (value.hasOwnProperty('value') || value.hasOwnProperty('name'))
  );
};
