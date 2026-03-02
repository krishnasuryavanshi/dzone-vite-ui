export const formatBooleanField = (
  value: boolean | null | undefined,
): string => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value == null) return '—';
  return value;
};
