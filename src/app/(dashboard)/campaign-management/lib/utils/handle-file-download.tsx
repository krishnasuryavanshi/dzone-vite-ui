import { saveFileFromBlob } from '@/lib/utils';

export const handleFileDownload = async (
  resourceFetcher: () => Promise<{ data: Blob; headers: Headers }>,
  fileNameHeader: string,
) => {
  try {
    const { data, headers } = await resourceFetcher();
    if (data) {
      const contentDisposition = headers.get(fileNameHeader) || '';
      const fileName =
        contentDisposition.split('filename=')[1]?.replace(/"/g, '') || 'downloaded-file';
      saveFileFromBlob(
        data,
        fileName,
        headers.get('content-type') || 'application/octet-stream', // 'application/octet-stream' part in the code is used to provide a default value for the MIME type in case the headers.get('content-type') returns null or undefined
      );
    }
  } catch (error) {}
};
