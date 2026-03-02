import { sanitizeText, sanitizeTextareaInput } from './string';

// Helper function to detect if text appears to be multiline/textarea content
const isMultilineText = (text: string): boolean => {
  // Check if the text contains newlines or carriage returns
  return /[\r\n]/.test(text);
};

export const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    // Auto-detect multiline content (textarea fields) by checking for newlines
    if (isMultilineText(data)) {
      // Use the existing sanitizeTextareaInput function
      let sanitized = sanitizeTextareaInput(data);

      // Additional processing for save operation
      // Only trim if the entire field is just whitespace
      if (sanitized.match(/^\s*$/)) {
        return ''; // If only whitespace, return empty string
      }
      // Remove only leading/trailing blank lines, not spaces for indentation
      sanitized = sanitized.replace(/^[\r\n]+|[\r\n]+$/g, '');
      return sanitized;
    }
    return sanitizeText(data);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item));
  }

  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, sanitizeData(value)]),
    );
  }

  return data;
};
