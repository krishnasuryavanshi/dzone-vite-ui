import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDataTypes } from '../services/fetch-data-types';

export function useDataTypesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.dataTypes(),
    queryFn: async () => {
      const result = await fetchDataTypes();
      if (!result) throw new Error('Failed to fetch data types');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    enabled,
  });
}
