import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { showNotification } from '@/services/notification';
import { Button } from '@/uicomponents';
import { FC, useMemo, useState } from 'react';
import { IDialogState } from '../../lib/types';
import { getUploadProps, handleUploadApi } from '../../lib/utils';
import { UploadButtonIcon } from './upload-button-icon';
import { UploadDialog } from './upload-dialog';
import { UploadSuccessContent } from './upload-success-content';
import { FileUploadModal } from '@/app/(dashboard)/components/file-upload-modal-component/file-upload-modal';
import { FileTypeSelection } from '@/app/(dashboard)/lib/enums';
import { useFileUploadMetadataQuery } from '../../hooks';

interface IUploadLeadsProps {
  lineItemId: string;
  refreshLeadsList: () => void;
  tenantCode?: string;
  validationSettingsId?: string; // Added validationSettingsId prop
  onUploadStart?: (requestId?: string) => void;
}

export const UploadLeads: FC<IUploadLeadsProps> = ({
  lineItemId,
  refreshLeadsList, // Kept for backward compatibility
  tenantCode,
  validationSettingsId,
  onUploadStart,
}) => {
  const [dialogState, setDialogState] = useState<IDialogState>({
    isDialogOpen: false,
    dialogType: 'Progress',
    progress: 0,
    message: '',
  });

  const [selectedFile, setSelectedFile] = useState<UploadFile>({} as UploadFile);
  const [selectedType, setSelectedType] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSelectedFile = (file: UploadFile) => {
    setSelectedFile(file);
  };

  const handleDialogState = (stateItem: Record<string, string | number | boolean>) => {
    setDialogState((state) => ({ ...state, ...stateItem }));
  };

  const handleCloseDialog = () => {
    setDialogState((state) => ({ ...state, isDialogOpen: false }));
  };

  const { data: metadataResponse, isLoading } = useFileUploadMetadataQuery('lead-file');

  const uploadProps: UploadProps = useMemo(() => {
    if (!metadataResponse?.data) return {};
    return getUploadProps(metadataResponse.data, handleDialogState, handleSelectedFile);
  }, [metadataResponse]);

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const handleCancel = () => {
    setSelectedFile({} as UploadFile);
    setSelectedType('');
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
      if (selectedType === '') {
        showNotification({
          type: 'error',
          message: 'Please select if net new leads or existing leads',
        });
        return;
      }
      setIsUploading(true);
      const response = await handleUploadApi(
        selectedFile.originFileObj as Blob,
        lineItemId,
        selectedType,
        handleDialogState,
        tenantCode || '',
      );
      if (response?.requestId) {
        // Trigger validation monitoring in parent component with requestId
        onUploadStart?.(response.requestId);
        handleCancel();
      }
    } catch (error) {
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        type='primary'
        size='small'
        className='dz-btn-action-1'
        style={{ width: '5.6rem', boxShadow: 'none' }}
        onClick={() => !isLoading && setIsModalOpen(true)}
      >
        <UploadButtonIcon isLoading={isLoading} />
      </Button>
      <FileUploadModal
        isOpen={isModalOpen}
        handleCancel={handleCancel}
        handleSave={handleSave}
        uploadProps={uploadProps}
        selectedFile={selectedFile}
        handleTypeSelection={handleTypeSelection}
        fileTypeSelection={FileTypeSelection.Leads}
        title='Upload Lead File'
        isUploading={isUploading}
        downloadTemplateProps={{
          lineItemId,
          validationSettingsId, // TODO: Replace with actual value if available
          tenantCode: tenantCode,
        }}
      />
      <UploadDialog dialogState={dialogState} onClose={handleCloseDialog}>
        <UploadSuccessContent
          show={dialogState.dialogType === 'Success'}
          info={dialogState.info}
          onClickViewLeads={handleDialogState}
        />
      </UploadDialog>
    </>
  );
};
