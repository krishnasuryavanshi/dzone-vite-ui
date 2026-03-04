import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { Modal } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { ModalHeader } from './modal-header';
import { TypeCheckRow } from './type-check-row';
import { DownloadTemplateRow } from './download-template-row';
import { UploadButtonRow } from './upload-button-row';
import { ActionsRow } from './actions-row';
import { FileTypeSelection } from '../../lib/enums';
import './file-upload-modal.scss';

interface IFileUploadModalProps {
  isOpen: boolean;
  title: string;
  uploadProps: UploadProps;
  selectedFile: UploadFile;
  handleCancel: () => void;
  handleSave: () => void;
  handleTypeSelection: (value: string) => void;
  // Optional: A flag or content for other types of files
  fileTypeSelection: FileTypeSelection; // For file types (e.g. Leads, Templates)
  additionalContent?: React.ReactNode; // For extra content like instructions or file-specific info
  downloadTemplateProps?: Record<string, any>;
  isUploading?: boolean; // Added for loading state
}

export const FileUploadModal: FC<IFileUploadModalProps> = ({
  isOpen,
  title,
  uploadProps,
  selectedFile,
  handleCancel,
  handleSave,
  handleTypeSelection,
  fileTypeSelection,
  additionalContent = null,
  downloadTemplateProps,
  isUploading = false,
}) => {
  const [enableSave, setEnableSave] = useState<boolean>(false);

  useEffect(() => {
    if (selectedFile.originFileObj) {
      setEnableSave(true);
    } else {
      setEnableSave(false);
    }
  }, [selectedFile]);

  return (
    <Modal
      className='dz-modal-file-upload'
      open={isOpen}
      width={800}
      centered
      footer={null}
      closable={false}
      destroyOnClose
      maskClosable={false}
      title={<ModalHeader title={title} />}
    >
      <Flex vertical gap={'1rem'} style={{ padding: '1.25rem 1.5rem' }}>
        {fileTypeSelection === FileTypeSelection.Templates && (
          <DownloadTemplateRow
            fileTypeSelection={fileTypeSelection}
            downloadTemplateProps={downloadTemplateProps}
          />
        )}
        {additionalContent}

        {fileTypeSelection === FileTypeSelection.Leads && (
          <TypeCheckRow onTypeChange={handleTypeSelection} />
        )}

        <UploadButtonRow uploadProps={uploadProps} fileName={selectedFile?.name} />

        <ActionsRow
          enableSave={enableSave}
          handleCancel={handleCancel}
          handleSave={handleSave}
          fileTypeSelection={fileTypeSelection}
          isUploading={isUploading}
        />
      </Flex>
    </Modal>
  );
};
