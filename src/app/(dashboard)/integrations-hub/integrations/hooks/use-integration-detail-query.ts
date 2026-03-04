import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchIntegrationDetails } from '../[id]/services/fetch-integration-details';

export function useIntegrationDetailQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.integrations.detail(id),
    queryFn: () => fetchIntegrationDetails(id),
    enabled: !!id && enabled,
  });
}
