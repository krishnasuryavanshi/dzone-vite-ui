import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchIntegrationTypes } from '../services';

export function useIntegrationTypesQuery() {
  return useQuery({
    queryKey: queryKeys.integrations.types(),
    queryFn: () => fetchIntegrationTypes(),
  });
}
