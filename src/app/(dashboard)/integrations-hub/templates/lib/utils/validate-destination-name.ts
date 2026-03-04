import {
  DESTINATION_NAME_ALREADY_EXISTED,
  DESTINATION_NAME_FIELD_LENGTH,
  DESTINATION_NAME_NO_TRAILING_SPACES,
  DESTINATION_NAME_RESERVED,
  DESTINATION_NAME_SHOULD_NOT_BE_NUMERIC,
  DESTINATION_NAME_VALID_PATTERN,
  REQUIRED_FIELD,
} from '@/app/(dashboard)/campaign-management/lib/constants';

export const validateDestinationName = (
  destinationName: string,
  reservedNames: string[] | undefined,
  destinationFieldNames: string[] | undefined,
  templateFieldName: string,
  updateErrors: (fieldName: string, hasError: boolean) => void,
) => {
  let error = { error: false, message: '' };

  // Trim any extra spaces at the beginning or end
  const trimmedDestinationName = destinationName.trim();

  // 1. Check if destination name is empty
  if (destinationName === '') {
    error = { error: true, message: REQUIRED_FIELD };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 2. Check if the length is between 1 and 255 characters
  if (destinationName.length < 1 || destinationName.length > 255) {
    error = { error: true, message: DESTINATION_NAME_FIELD_LENGTH };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 3. Check if the name can only contain letters, numbers, spaces, and underscores
  const validPattern = /^[A-Za-z0-9_ \-\[\]()#$]+$/;
  if (!validPattern.test(destinationName)) {
    error = { error: true, message: DESTINATION_NAME_VALID_PATTERN };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 4. Check if the name starts or ends with a space
  if (destinationName !== trimmedDestinationName) {
    error = { error: true, message: DESTINATION_NAME_NO_TRAILING_SPACES };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 5. Check if the name is purely numeric
  const noNumericOnly = /^(?!\d+$).*/;
  if (!noNumericOnly.test(destinationName)) {
    error = { error: true, message: DESTINATION_NAME_SHOULD_NOT_BE_NUMERIC };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 6. Check if the name is a reserved name
  if (reservedNames?.includes(destinationName)) {
    error = { error: true, message: DESTINATION_NAME_RESERVED };
    updateErrors(templateFieldName, true);
    return error;
  }

  // 7. Check if the name already exists (case insensitive check)
  if (
    destinationFieldNames?.some(
      (existingName) => existingName.toLowerCase() === destinationName.toLowerCase(),
    )
  ) {
    error = { error: true, message: DESTINATION_NAME_ALREADY_EXISTED };
    updateErrors(templateFieldName, true);
    return error;
  }

  // If no error, return no error and update the context
  updateErrors(templateFieldName, false);
  return error;
};
