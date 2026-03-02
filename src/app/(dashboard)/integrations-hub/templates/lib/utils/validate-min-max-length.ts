import {
  MAX_CHARACTERS_GREATER_THAN_MIN_ERROR_MESSAGE,
  MAXIMUM_CHARACTERS_VALUE_MAXIMUM_LIMIT_ERROR_MESSAGE,
  MINIMUM_CHARACTERS_VALUE_MAXIMUM_LIMIT_ERROR_MESSAGE,
  MINIMUN_CHARACTERS_LESSER_THAN_MAX_ERROR_MESSAGE,
} from '@/app/(dashboard)/campaign-management/lib/constants';
import { FormInstance } from '@/uicomponents/form';

export const validateMinMaxLengthSync = (
  form: FormInstance<any>,
  updateFieldErrorStatus: (name: string, hasError: boolean) => void,
  currentField: 'minLength' | 'maxLength',
  minLength?: number | null,
  maxLength?: number | null,
) => {
  const error = validateMinMaxLength(
    updateFieldErrorStatus,
    minLength,
    maxLength,
    currentField,
  );

  if (error.error) {
    // Set the error for specific fields
    form.setFields([
      {
        name: ['characters', error.field], // Use the field from the error object
        errors: error.message ? [error.message] : [],
      },
    ]);
    return error;
  }

  // If validation passes, clear the errors for both fields
  form.setFields([
    {
      name: ['characters', 'minLength'],
      errors: [],
    },
    {
      name: ['characters', 'maxLength'],
      errors: [],
    },
  ]);

  return null;
};

export const validateMinMaxLength = (
  updateErrors: (fieldName: string, hasError: boolean) => void,
  minLength?: string | number | null,
  maxLength?: string | number | null,
  currentField?: 'minLength' | 'maxLength', // Add currentField parameter
) => {
  let error = { error: false, field: '', message: '' };

  // Convert empty strings to undefined and ensure min/max are numbers
  minLength =
    minLength === '' || minLength === null ? undefined : Number(minLength);
  maxLength =
    maxLength === '' || maxLength === null ? undefined : Number(maxLength);

  // Validation for minLength
  if (currentField === 'minLength') {
    // Check if minLength exceeds the upper limit
    if (minLength && minLength > 9999) {
      error = {
        error: true,
        field: 'minLength',
        message: MINIMUM_CHARACTERS_VALUE_MAXIMUM_LIMIT_ERROR_MESSAGE,
      };
      updateErrors('minLength', true);
      return error;
    }

    // check if minlength is lesser then maxLength
    if (minLength && maxLength && minLength >= maxLength) {
      error = {
        error: true,
        field: 'minLength',
        message: MINIMUN_CHARACTERS_LESSER_THAN_MAX_ERROR_MESSAGE,
      };
      updateErrors('minLength', true);
      return error;
    }
  }

  // Validation for maxLength
  if (currentField === 'maxLength') {
    // Check if maxLength exceeds the upper limit
    if (maxLength && maxLength > 10000) {
      error = {
        error: true,
        field: 'maxLength',
        message: MAXIMUM_CHARACTERS_VALUE_MAXIMUM_LIMIT_ERROR_MESSAGE,
      };
      updateErrors('maxLength', true);
      return error;
    }

    // If maxLength is corrected, clear any related error on minLength
    if (minLength && maxLength && minLength < maxLength) {
      updateErrors('minLength', false); // Clear error for minLength
    }

    if (minLength && maxLength && maxLength <= minLength) {
      error = {
        error: true,
        field: 'maxLength',
        message: MAX_CHARACTERS_GREATER_THAN_MIN_ERROR_MESSAGE,
      };
      updateErrors('maxLength', true);
      return error;
    }
  }

  // Clear errors when the values are valid
  updateErrors('minLength', false);
  updateErrors('maxLength', false);

  return error;
};
