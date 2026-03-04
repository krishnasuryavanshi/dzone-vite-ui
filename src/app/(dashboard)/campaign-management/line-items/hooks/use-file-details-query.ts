import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFileDetails } from '../services';

export function useFileDetailsQuery(fileId?: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.fileUpload.all, 'details', fileId],
    queryFn: () => fetchFileDetails(fileId!),
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: !!fileId && enabled,
  });
}
