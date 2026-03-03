import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchAllModules } from '../services';

export function useModulesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.roles.modules(),
    queryFn: async () => {
      const result = await fetchAllModules();
      if (!result) throw new Error('Failed to fetch modules');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
