import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchFileUploadMetadata } from '@/services/file-upload';

export function useFileUploadMetadataQuery(fileTypeName: string) {
  return useQuery({
    queryKey: queryKeys.fileUpload.metadata(fileTypeName),
    queryFn: async () => {
      const result = await fetchFileUploadMetadata(fileTypeName);
      if (!result) throw new Error('Failed to fetch file upload metadata');
      return result;
    },
    staleTime: 30 * 60 * 1000,
  });
}
