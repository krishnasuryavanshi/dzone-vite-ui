/**
 * Checks if filters have any active values
 * @param filteredInfo - Object containing filter values
 * @returns boolean indicating if any filters are active
 */
export const hasActiveFilters = (
  filteredInfo: Record<string, any>,
): boolean => {
  return Object.values(filteredInfo).some(
    (value) =>
      value !== null &&
      value !== undefined &&
      (Array.isArray(value) ? value.length > 0 : value !== ''),
  );
};

/**
 * Checks if a single filter value is active
 * @param value - The filter value to check
 * @returns boolean indicating if the filter value is active
 */
export const isFilterValueActive = (value: any): boolean => {
  return (
    value !== null &&
    value !== undefined &&
    (Array.isArray(value) ? value.length > 0 : value !== '')
  );
};

/**
 * Removes empty filters from the filter object
 * @param filteredInfo - Object containing filter values
 * @returns Object with only active filters
 */
export const getActiveFilters = (
  filteredInfo: Record<string, any>,
): Record<string, any> => {
  return Object.entries(filteredInfo).reduce(
    (acc, [key, value]) => {
      if (isFilterValueActive(value)) {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, any>,
  );
};
