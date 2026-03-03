import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchPrefilledListsBasicDetails } from '../services';

export function usePrefilledListsBasicDetailsQuery(userId?: string) {
  return useQuery({
    queryKey: queryKeys.prefilledLists.basicDetails(userId),
    queryFn: () => fetchPrefilledListsBasicDetails(userId),
  });
}
