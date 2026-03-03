import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchAllLeadValidationSettings } from '../services';

export function useValidationSettingsQuery(
  page: number,
  size: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.validationSettings.list({ page, size }),
    queryFn: async () => {
      const result = await fetchAllLeadValidationSettings(page, size);
      if (!result) throw new Error('Failed to fetch validation settings');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
