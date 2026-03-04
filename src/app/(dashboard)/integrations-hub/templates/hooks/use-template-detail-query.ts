import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchTemplateDetails } from '../services';

export function useTemplateDetailQuery(templateId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.detail(templateId),
    queryFn: async () => {
      const result = await fetchTemplateDetails(templateId);
      if (!result) throw new Error('Failed to fetch template details');
      return result;
    },
    enabled: !!templateId && enabled,
  });
}
