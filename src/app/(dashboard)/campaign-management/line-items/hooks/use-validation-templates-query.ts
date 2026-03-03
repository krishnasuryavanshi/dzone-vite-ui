import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchValidationTemplates } from '../services';

export function useValidationTemplatesQuery(orgCode: string | undefined) {
  return useQuery({
    queryKey: queryKeys.validationTemplates.byOrg(orgCode ?? ''),
    queryFn: async () => {
      const result = await fetchValidationTemplates(orgCode!);
      if (!result) throw new Error('Failed to fetch validation templates');
      return result;
    },
    enabled: !!orgCode,
  });
}
