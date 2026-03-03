import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchIntegrations } from '../services';

export function useIntegrationsQuery() {
  return useQuery({
    queryKey: queryKeys.integrations.lists(),
    queryFn: () => fetchIntegrations(),
  });
}
