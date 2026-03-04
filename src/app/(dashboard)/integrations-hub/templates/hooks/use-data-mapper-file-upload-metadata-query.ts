import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchDataMapperFileUploadMetadata } from '../services/fetch-data-mapper-file-upload-metadata';

export function useDataMapperFileUploadMetadataQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.templates.dataMapperMetadata(),
    queryFn: async () => {
      const result = await fetchDataMapperFileUploadMetadata();
      if (!result) throw new Error('Failed to fetch data mapper file upload metadata');
      return result;
    },
    staleTime: 30 * 60 * 1000,
    enabled,
  });
}
