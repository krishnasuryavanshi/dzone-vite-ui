import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { TargetingFileUpload } from './targeting-file-upload';
import { UploadedFilePreview } from './uploaded-file-preview';
import { useValidationSettingStore } from '../../../store';

type TargetingFileProps = {
  value?: DzRecord[];
  handleRemoveFile: (file: DzRecord) => void;
  acceptedFileTypes?: string[];
  onFileChange: (file: DzRecord) => Promise<boolean>;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const TargetingFile = ({
  value,
  handleRemoveFile,
  acceptedFileTypes,
  onFileChange,
  isDisabled,
  isLoading,
}: TargetingFileProps) => {
  const { isReadOnly } = useValidationSettingStore();
  return (
    <Flex vertical gap={'0.75rem'} style={{ width: '100%' }}>
      <UploadedFilePreview
        value={value}
        handleRemoveFile={handleRemoveFile}
        isReadonly={isReadOnly}
      />
      <TargetingFileUpload
        acceptedFileTypes={acceptedFileTypes}
        onFileChange={onFileChange}
        isDisabled={isDisabled || isReadOnly}
        isLoading={isLoading}
      />
    </Flex>
  );
};
