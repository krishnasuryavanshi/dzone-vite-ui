import { convertToBytes } from '@/lib/utils';
import { getExtension } from '@/lib/utils/string';
import { showNotification } from '@/services/notification';
import { IFileUploadMeta } from '../types';

export const isFileValid = (fileMeta: IFileUploadMeta, info: any) => {
  const { name, size } = info.file;
  const extension = getExtension(name);
  const allowedFileSize = convertToBytes(fileMeta?.file?.size);

  let message = '';
  let hasError = false;

  if (!fileMeta?.file?.types?.map((t) => t.toLowerCase()).includes(extension.toLowerCase())) {
    hasError = true;
    message = `Please upload a file with these extensions: ${fileMeta?.file?.types.join(', ')}`;
  } else if (size > allowedFileSize) {
    hasError = true;
    message = `File size should be less than ${fileMeta?.file?.size}`;
  }

  if (hasError) {
    showNotification({
      type: 'error',
      message,
    });
  }

  return !hasError;
};
