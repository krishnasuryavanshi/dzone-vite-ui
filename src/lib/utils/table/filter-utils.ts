export interface DateRangeValue {
  from?: string | null;
  to?: string | null;
}

/**
 * Processes filter information with support for date range objects.
 * Handles both array-wrapped and direct date range objects.
 *
 * @param filterInfo - The filter information object
 * @returns Processed filters ready for API consumption
 */
export const processFiltersWithDateRange = <T extends Record<string, any>>(
  filterInfo: T,
) => {
  return Object.entries(filterInfo)
    .filter(([, value]) => {
      // Check if it's an array with date range object inside
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        'from' in value[0]
      ) {
        const dateRange = value[0] as DateRangeValue;
        const hasFrom = dateRange.from !== null && dateRange.from !== undefined;
        const hasTo = dateRange.to !== null && dateRange.to !== undefined;
        return hasFrom || hasTo;
      }

      // Handle direct date range object filters
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        'from' in value
      ) {
        const dateRange = value as DateRangeValue;
        const hasFrom = dateRange.from !== null && dateRange.from !== undefined;
        const hasTo = dateRange.to !== null && dateRange.to !== undefined;
        return hasFrom || hasTo;
      }

      return value !== null && value !== undefined;
    })
    .map(([key, value]) => {
      // Transform array with date range object to just the object
      if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        'from' in value[0]
      ) {
        return {
          key,
          value: value[0], // Extract the object from the array
        };
      }

      return {
        key,
        value,
      };
    });
};
