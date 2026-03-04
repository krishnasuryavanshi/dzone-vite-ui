import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFilterOptions } from '../../services';
import { FILTER_URL_MAP } from './use-leads-column-details';

// Type definitions for return values
type SingleFieldReturn = {
  options: string[];
  isLoading: boolean;
  error: Error | null;
};

type MultipleFieldsReturn = {
  optionsMap: Record<string, string[]>;
  isLoading: boolean;
  errors: Record<string, Error>;
};

/**
 * Unified hook to fetch filter options for single or multiple fields
 */
export function useFilterOptions(
  fieldNames: string | string[],
): SingleFieldReturn | MultipleFieldsReturn {
  // Convert single field to array for consistent handling
  const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
  const isSingleField = !Array.isArray(fieldNames);

  const validFields = useMemo(
    () => fields.filter((fieldName) => !!FILTER_URL_MAP[fieldName]),
    [JSON.stringify(fields)],
  );

  const queries = useQueries({
    queries: validFields.map((fieldName) => ({
      queryKey: [...queryKeys.leads.filterOptions(), fieldName],
      queryFn: () => fetchFilterOptions(FILTER_URL_MAP[fieldName]),
      staleTime: 30 * 60 * 1000,
      enabled: fields.length > 0,
    })),
  });

  const optionsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    validFields.forEach((fieldName, index) => {
      map[fieldName] = queries[index]?.data ?? [];
    });
    return map;
  }, [validFields, queries]);

  const errors = useMemo(() => {
    const errs: Record<string, Error> = {};
    validFields.forEach((fieldName, index) => {
      if (queries[index]?.error) {
        errs[fieldName] = queries[index].error as Error;
      }
    });
    return errs;
  }, [validFields, queries]);

  const isLoading = queries.some((q) => q.isLoading);

  // Return single field format for backward compatibility
  if (isSingleField && fields[0]) {
    return {
      options: optionsMap[fields[0]] || [],
      isLoading,
      error: errors[fields[0]] || null,
    } as SingleFieldReturn;
  }

  // Return multiple fields format
  return {
    optionsMap,
    isLoading,
    errors,
  } as MultipleFieldsReturn;
}

// Export alias for backward compatibility with existing code
export const useAllFilterOptions = (fieldNames: string[]): MultipleFieldsReturn => {
  return useFilterOptions(fieldNames) as MultipleFieldsReturn;
};
