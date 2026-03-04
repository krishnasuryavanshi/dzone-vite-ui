import { UploadButtonIcon } from '@/app/(dashboard)/campaign-management/line-items/components/upload-leads/upload-button-icon';
import {
  IFileMeta,
  IFileUploadMetaData,
} from '@/app/(dashboard)/campaign-management/line-items/lib/types';
import { getUploadProps } from '@/app/(dashboard)/campaign-management/line-items/lib/utils';
import { FileUploadModal } from '@/app/(dashboard)/components/file-upload-modal-component/file-upload-modal';
import { FileTypeSelection } from '@/app/(dashboard)/lib/enums';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents';
import { FC, useEffect, useState } from 'react';
import { uploadDataMapperFile } from '../../../services';

interface IUploadTemplatesProps {
  onFileUpload: (
    fileData: {
      id: string;
      fileName: string;
      fileType: string;
      fileSize: string;
      location: string;
    } | null,
  ) => void;
  mapperFileUploadMetadata?: IFileUploadMetaData;
  type: string;
  isDisabled?: boolean;
}

export const UploadTemplates: FC<IUploadTemplatesProps> = ({
  onFileUpload,
  mapperFileUploadMetadata,
  type,
  isDisabled,
}) => {
  const [uploadProps, setUploadProps] = useState<UploadProps>({});
  const [selectedFile, setSelectedFile] = useState<UploadFile>({} as UploadFile);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectedFile = (file: UploadFile) => {
    setSelectedFile(file);
  };

  useEffect(() => {
    if (mapperFileUploadMetadata) {
      setupFileUploadProps();
    }
  }, [mapperFileUploadMetadata]);

  const setupFileUploadProps = async () => {
    setUploadProps(
      getUploadProps(
        mapperFileUploadMetadata?.file as IFileUploadMetaData,
        () => null,
        handleSelectedFile,
      ),
    );
    setIsLoading(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    try {
      if (!selectedFile.originFileObj) {
        showNotification({
          type: 'error',
          message: 'Please select a file',
        });
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile.originFileObj as Blob);
      const data = await uploadDataMapperFile(formData);
      onFileUpload(data?.data);
      // Close the modal
      setIsModalOpen(false);
    } catch (error) {}
  };

  return (
    <>
      <Button
        type='primary'
        size='large'
        onClick={() => !isLoading && setIsModalOpen(true)}
        disabled={isDisabled}
      >
        <UploadButtonIcon isLoading={isLoading} label='Upload a Data Mapping' />
      </Button>
      <FileUploadModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSave={handleSave}
        uploadProps={uploadProps}
        selectedFile={selectedFile}
        handleTypeSelection={() => null}
        fileTypeSelection={FileTypeSelection.Templates}
        title='Upload Data Mapping File'
        downloadTemplateProps={{
          type,
        }}
      />
    </>
  );
};
