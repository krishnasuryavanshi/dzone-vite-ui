/**
 * Utility functions for chip input components
 */

export const CHIP_DELIMITERS = /[,\t\n;]/;

/**
 * Split input text by delimiters and return cleaned values
 */
export const splitChipValues = (input: string): string[] => {
  return input
    .split(CHIP_DELIMITERS)
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
};

/**
 * Check if input contains any delimiter characters
 */
export const containsDelimiter = (input: string): boolean => {
  return CHIP_DELIMITERS.test(input);
};

/**
 * Process input value and extract chips
 * Returns an object with chips to add and remaining input
 */
export const processChipInput = (
  input: string,
  existingValues: string[] = [],
): {
  newValues: string[];
  duplicates: string[];
  remainingInput: string;
} => {
  // If no delimiters, return as-is
  if (!containsDelimiter(input)) {
    return {
      newValues: [],
      duplicates: [],
      remainingInput: input,
    };
  }

  const values = splitChipValues(input);
  const newValues: string[] = [];
  const duplicates: string[] = [];
  let remainingInput = '';

  // Check if input ends with delimiter
  const endsWithDelimiter = CHIP_DELIMITERS.test(input[input.length - 1] || '');

  values.forEach((value, index) => {
    const isLastValue = index === values.length - 1;
    const normalizedValue = value.toLowerCase();
    const normalizedExisting = existingValues.map((v) => v.toLowerCase());

    if (isLastValue && !endsWithDelimiter) {
      // Keep last value in input for further editing
      remainingInput = value;
    } else if (
      !normalizedExisting.includes(normalizedValue) &&
      !newValues.some((v) => v.toLowerCase() === normalizedValue)
    ) {
      newValues.push(value);
    } else if (!duplicates.includes(value)) {
      duplicates.push(value);
    }
  });

  return { newValues, duplicates, remainingInput };
};

/**
 * Handle keyboard events for chip creation
 */
export const shouldCreateChip = (key: string): boolean => {
  return key === 'Enter' || key === 'Tab';
};

/**
 * Process pasted text for chip creation
 */
export const processPastedText = (
  pastedText: string,
  existingValues: string[] = [],
): {
  newValues: string[];
  duplicates: string[];
} => {
  const values = splitChipValues(pastedText);
  const newValues: string[] = [];
  const duplicates: string[] = [];
  const normalizedExisting = existingValues.map((v) => v.toLowerCase());

  values.forEach((value) => {
    const normalizedValue = value.toLowerCase();

    if (
      !normalizedExisting.includes(normalizedValue) &&
      !newValues.some((v) => v.toLowerCase() === normalizedValue)
    ) {
      newValues.push(value);
    } else if (!duplicates.includes(value)) {
      duplicates.push(value);
    }
  });

  return { newValues, duplicates };
};
