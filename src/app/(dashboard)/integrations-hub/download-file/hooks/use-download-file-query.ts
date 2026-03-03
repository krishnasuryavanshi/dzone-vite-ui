import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { deliveryFileDownload } from '../services/delivery-file-download';

export function useDownloadFileQuery(token: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.deliveryFile.download(token),
    queryFn: async () => {
      const result = await deliveryFileDownload(token);
      if (!result) throw new Error('Failed to download file');
      return result;
    },
    enabled: !!token && enabled,
    retry: false,
  });
}
