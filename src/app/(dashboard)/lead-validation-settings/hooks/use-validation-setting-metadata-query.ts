import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchLeadValidationSettingMetadata } from '../services';

export function useValidationSettingMetadataQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.validationSettings.metadata(),
    queryFn: async () => {
      const result = await fetchLeadValidationSettingMetadata();
      if (!result) throw new Error('Failed to fetch validation setting metadata');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
}
