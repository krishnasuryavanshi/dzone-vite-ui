import { uploadFile } from '@/services/file-upload';
import { showNotification } from '@/services/notification';
import { FileAttachment, FileUploadStatus } from '../lib/types';
import { convertToBytes } from '@/lib/utils';
import { logError } from '@/services/logger';

// File validation constants
const ALLOWED_EXTENSIONS = ['.csv', '.pdf'];
const MAX_FILE_SIZE = '10MB';
const MAX_FILE_COUNT = 10;
const FILE_TYPE_NAME = 'chat-file';

interface UploadResult {
  id: string;
  name: string;
  size: string; // e.g., "176.89KB"
  type: string; // Always "chat-file" from API
  fileKey: string;
}

export const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  const maxBytes = convertToBytes(MAX_FILE_SIZE);
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File exceeds ${MAX_FILE_SIZE} size limit`,
    };
  }

  // Check file type
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `File type not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
};

export const uploadChatFiles = async (
  files: File[],
  tenantCode: string,
  currentAttachmentCount: number = 0,
  onFileStart?: (file: File, tempId: string) => void,
  onFileProgress?: (tempId: string, progress: number) => void,
  onFileComplete?: (tempId: string, attachment: FileAttachment) => void,
  onFileError?: (tempId: string, error: string) => void,
): Promise<FileAttachment[]> => {
  const results: FileAttachment[] = [];
  const validFiles: { file: File; tempId: string }[] = [];

  // Check max file count
  const availableSlots = MAX_FILE_COUNT - currentAttachmentCount;
  if (availableSlots <= 0) {
    showNotification({
      type: 'error',
      message: `Maximum ${MAX_FILE_COUNT} files can be attached.`,
    });
    return results;
  }

  // Limit files to available slots
  const filesToProcess = files.slice(0, availableSlots);
  if (files.length > availableSlots) {
    showNotification({
      type: 'error',
      message: `Only ${availableSlots} more file(s) can be attached. Maximum is ${MAX_FILE_COUNT}.`,
    });
  }

  // Validate all files first
  for (const file of filesToProcess) {
    const validation = validateFile(file);
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    if (!validation.valid) {
      showNotification({
        type: 'error',
        message: `${file.name}: ${validation.error}`,
      });
      continue;
    }

    validFiles.push({ file, tempId });
    onFileStart?.(file, tempId);
  }

  if (validFiles.length === 0) {
    return results;
  }

  // Upload files
  try {
    const formData = new FormData();
    formData.append('tenantCode', tenantCode);
    formData.append('fileTypeName', FILE_TYPE_NAME);

    validFiles.forEach(({ file }) => {
      formData.append('files', file);
    });

    // Simulate progress for each file since the API doesn't provide real-time progress
    validFiles.forEach(({ tempId }) => {
      onFileProgress?.(tempId, 50);
    });

    const response = await uploadFile(formData);

    if (response?.data?.length) {
      const uploadedFiles = response.data as UploadResult[];

      uploadedFiles.forEach((uploadedFile, index) => {
        const originalFile = validFiles[index]?.file;
        const tempId = validFiles[index]?.tempId;

        const attachment: FileAttachment = {
          id: uploadedFile.id,
          name: uploadedFile.name,
          // Use original file's size (number) and MIME type
          size: originalFile?.size || 0,
          type: originalFile?.type || '',
          status: FileUploadStatus.SUCCESS,
          progress: 100,
        };
        results.push(attachment);

        if (tempId) {
          onFileComplete?.(tempId, attachment);
        }
      });
    }
  } catch (error) {
    logError(error);
    validFiles.forEach(({ tempId, file }) => {
      onFileError?.(tempId, 'Upload failed. Please try again.');
    });
    showNotification({
      type: 'error',
      message: 'Failed to upload files. Please try again.',
    });
  }

  return results;
};

export const getAcceptedFileTypes = (): string => {
  return ALLOWED_EXTENSIONS.join(',');
};

export const getMaxFileSize = (): string => {
  return MAX_FILE_SIZE;
};

export const getMaxFileCount = (): number => {
  return MAX_FILE_COUNT;
};
