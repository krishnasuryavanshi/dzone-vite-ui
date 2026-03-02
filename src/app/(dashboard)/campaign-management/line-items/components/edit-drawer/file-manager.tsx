import React, { useState, useEffect } from 'react';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { FileItem } from './file-item';
import { Modal } from '@/uicomponents/modal';
import { fileDownload } from '../../services';
import { UploadIcon } from '@/uicomponents/icons/svgs';
import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { showNotification } from '@/services';
import { fileSortAndUpload } from '@/app/(dashboard)/lead-validation-settings/lib/utils';
import { fetchFileUploadMetadata } from '@/services/file-upload';
import { Upload, UploadProps, Checkbox } from 'antd';
import { DzRecord } from '@/lib/types';
const { Dragger } = Upload;

export interface FileItemType {
  id: string;
  name: string;
  size?: number;
  type?: string;
  isDisabled: boolean; // false = file is enabled/active, true = file is disabled
  selected?: boolean; // This is for rendering checkbox state (inverted from isDisabled)
  uploadDate?: Date;
}

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  files: FileItemType[];
  onFilesChange: (files: FileItemType[]) => void;
  onSave: () => void;
  allowUpload?: boolean;
  allowDelete?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  inline?: boolean;
  onSelectionChange?: (
    fileData: Array<{ id: string; isDisabled: boolean }>,
  ) => void;
  attributeName?: string;
  fileMetadataTypeName?: string | null;
}

export const FileManager: React.FC<FileManagerProps> = ({
  isOpen,
  onClose,
  title,
  files,
  onFilesChange,
  onSave,
  allowUpload = true,
  allowDelete = true,
  maxFiles,
  acceptedFileTypes: defaultAcceptedFileTypes = ['.csv', '.xlsx', '.txt'],
  inline = false,
  onSelectionChange,
  attributeName,
  fileMetadataTypeName,
}) => {
  const { settingMetadata } = useValidationSettingStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMetadata, setUploadMetadata] = useState<Record<
    string,
    any
  > | null>(null);
  const [internalFiles, setInternalFiles] = useState<FileItemType[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Initialize internal files with the provided files
      // isDisabled: false means file is active/enabled (should be checked in UI)
      // isDisabled: true means file is disabled (should be unchecked in UI)
      const mappedFiles = files.map((file) => ({
        ...file,
        isDisabled: file.isDisabled ?? false, // Default to enabled if not specified
      }));
      setInternalFiles(mappedFiles);
    }
  }, [files, isOpen]);

  useEffect(() => {
    const fetchMeta = async (typeName: string) => {
      try {
        const { data } = await fetchFileUploadMetadata(typeName);
        setUploadMetadata(data || null);
      } catch (error) {
        setUploadMetadata(null);
      }
    };

    if (fileMetadataTypeName) {
      fetchMeta(fileMetadataTypeName);
    }
  }, [fileMetadataTypeName]);

  // Check if all files are selected (enabled/active)
  const allSelected =
    internalFiles.length > 0 && internalFiles.every((file) => !file.isDisabled);
  const someSelected = internalFiles.some((file) => !file.isDisabled);
  const isIndeterminate = someSelected && !allSelected;

  const handleSelectAll = (isSelected: boolean) => {
    // When checkbox is checked (isSelected=true), files should be enabled (isDisabled=false)
    const updatedFiles = internalFiles.map((file) => ({
      ...file,
      isDisabled: !isSelected, // Invert: checked means not disabled
    }));
    setInternalFiles(updatedFiles);
    onFilesChange(updatedFiles); // Pass updated files back to parent
  };

  const handleSelectFile = (fileId: string, isSelected: boolean) => {
    // When checkbox is checked (isSelected=true), file should be enabled (isDisabled=false)
    const updatedFiles = internalFiles.map((file) =>
      file.id === fileId ? { ...file, isDisabled: !isSelected } : file,
    );
    setInternalFiles(updatedFiles);
    onFilesChange(updatedFiles); // Pass updated files back to parent
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      await fileDownload(fileId);
    } catch (error) {
      showNotification({ type: 'error', message: 'File download failed.' });
    }
  };

  const handleDelete = (fileId: string) => {
    const updated = internalFiles.filter((f) => f.id !== fileId);
    setInternalFiles(updated);
    onFilesChange(updated);
  };

  const handleSaveClick = () => {
    onSave();
  };

  const draggerProps: UploadProps = {
    name: 'file',
    multiple: true,
    disabled: isUploading,
    fileList: [],
    accept:
      uploadMetadata?.types
        ?.map((t: string) => `.${t.toLowerCase()}`)
        .join(',') || defaultAcceptedFileTypes.join(','),
    showUploadList: false,
    beforeUpload: () => false,
    onChange: async (info) => {
      if (info.file.status === 'removed') return;

      const { file } = info;
      const acceptedTypes =
        (uploadMetadata?.types as string[])?.map(
          (t) => `.${t.toLowerCase()}`,
        ) || defaultAcceptedFileTypes;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;

      if (!acceptedTypes.includes(fileExtension)) {
        showNotification({
          type: 'error',
          message: `File type not supported. Please upload one of the following types: ${acceptedTypes.join(
            ', ',
          )}`,
        });
        return;
      }

      if (!fileMetadataTypeName) {
        showNotification({
          type: 'error',
          message: 'Cannot determine file type for upload.',
        });
        return;
      }

      const fileObject = { file: info.file, fileList: info.fileList };
      setIsUploading(true);
      try {
        const uploadedFilesResult = await fileSortAndUpload(
          fileObject as DzRecord,
          uploadMetadata as DzRecord,
          settingMetadata?.tenantCode,
          fileMetadataTypeName,
        );

        if (!uploadedFilesResult || uploadedFilesResult.length === 0) {
          throw new Error(
            'File upload failed. The server did not return any file data.',
          );
        }

        const newFiles: FileItemType[] = uploadedFilesResult.map((f: any) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          type: f.type,
          isDisabled: false, // isDisabled: false means the file is enabled/active (not disabled)
          uploadDate: new Date(),
        }));

        const updatedFiles = [...internalFiles, ...newFiles];
        setInternalFiles(updatedFiles);
        onFilesChange(updatedFiles); // Pass updated files back to parent
        showNotification({
          type: 'success',
          message: `File(s) uploaded successfully.`,
        });
      } catch (error: any) {
        showNotification({
          type: 'error',
          message:
            error.response?.data?.message ||
            error.message ||
            'File upload failed.',
        });
      } finally {
        setIsUploading(false);
      }
    },
  };

  const renderContent = () => (
    <DzBox>
      <Checkbox
        onChange={(e) => handleSelectAll(e.target.checked)}
        checked={allSelected}
        indeterminate={isIndeterminate}>
        Select All
      </Checkbox>
      {internalFiles.map((file) => (
        <FileItem
          key={file.id}
          file={{ ...file, selected: !file.isDisabled }} // Pass inverted value: checked when not disabled
          onSelect={handleSelectFile}
          onDelete={allowDelete ? handleDelete : undefined}
          onDownload={handleDownloadFile}
        />
      ))}
      {allowUpload && (
        <Dragger {...draggerProps}>
          <Flex vertical>
            <UploadIcon />
            <Text className='ant-upload-text'>
              {isUploading ? 'Uploading...' : 'Drop file to upload or '}
              {!isUploading && <a>browse</a>}
            </Text>
          </Flex>
        </Dragger>
      )}
    </DzBox>
  );

  if (inline) {
    return renderContent();
  }

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      title={title}
      width={500}
      footer={
        <Flex gap='0.75rem' justify='flex-end'>
          <Button onClick={onClose}>Cancel</Button>
          <Button type='primary' onClick={handleSaveClick}>
            Save
          </Button>
        </Flex>
      }>
      <DzBox style={{ padding: '0 0 1.5rem 0' }}>{renderContent()}</DzBox>
    </Modal>
  );
};
