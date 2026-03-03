import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchTemplates } from '../services';

export function useTemplatesListQuery(
  page: number,
  size: number,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.templates.list({ page, size }),
    queryFn: async () => {
      const result = await fetchTemplates(page, size);
      if (!result) throw new Error('Failed to fetch templates');
      return result;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
}
