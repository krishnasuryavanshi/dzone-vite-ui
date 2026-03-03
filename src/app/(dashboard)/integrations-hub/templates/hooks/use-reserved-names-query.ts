import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchReservedDestinationNames } from '../services';

export function useReservedNamesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.reservedNames(),
    queryFn: async () => {
      const result = await fetchReservedDestinationNames();
      if (!result) throw new Error('Failed to fetch reserved names');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    enabled,
  });
}
