
import { PaperClipOutlined } from '@/uicomponents/icons';
import { Upload } from '@/uicomponents/upload';
import { getAcceptedFileTypes } from '../services';
import { COLORS } from '../lib/constants/colors';

interface InputUploadButtonProps {
  isStreaming: boolean;
  inputDisabled: boolean;
  tenantCode: string | null;
  onFilesUpload: (files: File[]) => void;
}

export const InputUploadButton = ({
  isStreaming,
  inputDisabled,
  tenantCode,
  onFilesUpload,
}: InputUploadButtonProps) => {
  const uploadProps = {
    accept: getAcceptedFileTypes(),
    multiple: true,
    showUploadList: false,
    beforeUpload: (file: File, fileList: File[]) => {
      if (file === fileList[0]) {
        onFilesUpload(fileList);
      }
      return false;
    },
    disabled: inputDisabled || isStreaming || !tenantCode,
  };

  const isDisabled = inputDisabled || isStreaming;

  return (
    <Upload {...uploadProps}>
      <PaperClipOutlined
        style={{
          fontSize: '1.25rem',
          color: isDisabled ? '#bfbfbf' : COLORS.GRAY_DARK,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          paddingBottom: '0.125rem',
        }}
      />
    </Upload>
  );
};
