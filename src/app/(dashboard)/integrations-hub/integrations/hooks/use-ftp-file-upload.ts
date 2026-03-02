import { useState, useEffect, useCallback } from 'react';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { fetchFileUploadMetadata } from '@/services/file-upload';
import { showNotification } from '@/services/notification';
import { useSession } from 'next-auth/react';
import { uploadSingleFile } from '@/app/(dashboard)/campaign-management/line-items/services/upload-single-file';

const FILE_TYPE_NAME = 'private-key-file';
const ACCEPTED_FILE_EXTENSIONS = '.pem,.ppk,.key';

interface UseFileUploadLogicReturn {
  fileList: UploadFile[];
  isUploading: boolean;
  uploadProps: UploadProps;
  handleRemoveFile: () => void;
  resetFileState: () => void;
}

export const useFtpFileUpload = (
  form: any,
  open: boolean,
): UseFileUploadLogicReturn => {
  const { data: session } = useSession();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploadMetadata, setUploadMetadata] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMetadata = useCallback(async () => {
    try {
      const response = await fetchFileUploadMetadata(FILE_TYPE_NAME);
      if (response?.data) {
        setUploadMetadata(response.data);
      }
    } catch (error) {
      // Silent fail - metadata is optional
    }
  }, []);

  const resetFileState = useCallback(() => {
    setFileList([]);
    setIsUploading(false);
    if (form) {
      form.setFieldsValue({ privateKeyFileId: undefined });
    }
  }, [form]);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const tenantCode = session?.tenantCode?.[0] || '';
        if (!tenantCode) {
          throw new Error('Tenant code not available');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileTypeName', FILE_TYPE_NAME);
        formData.append('tenantCode', tenantCode);

        const response = await uploadSingleFile(formData);

        if (response?.data) {
          if (form) {
            const fileId = response.data.id || response.data;
            form.setFieldsValue({ privateKeyFileId: fileId });
          }

          showNotification({
            type: 'success',
            message: 'Private key file uploaded successfully',
          });

          return false;
        } else {
          throw new Error('Upload failed - no data returned');
        }
      } catch (error: any) {
        showNotification({
          type: 'error',
          message: error.message || 'Failed to upload private key file',
        });
        return false;
      } finally {
        setIsUploading(false);
      }
    },
    [session, form],
  );

  const handleRemoveFile = useCallback(() => {
    // Clear file list immediately
    setFileList([]);
    // Clear form field
    if (form) {
      form.setFieldsValue({ privateKeyFileId: undefined });
    }
  }, [form]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    // Always reset file state when modal state changes
    resetFileState();
  }, [open, resetFileState]);

  const uploadProps: UploadProps = {
    name: 'privateKeyFile',
    fileList,
    maxCount: 1,
    accept:
      uploadMetadata?.allowedExtensions?.join(',') || ACCEPTED_FILE_EXTENSIONS,
    beforeUpload: handleFileUpload,
    onChange: ({ fileList: newFileList }) => {
      // Only update fileList if it's not an empty array from removal
      setFileList(newFileList);
    },
    onRemove: () => {
      handleRemoveFile();
      return true;
    },
  };

  return {
    fileList,
    isUploading,
    uploadProps,
    handleRemoveFile,
    resetFileState,
  };
};
