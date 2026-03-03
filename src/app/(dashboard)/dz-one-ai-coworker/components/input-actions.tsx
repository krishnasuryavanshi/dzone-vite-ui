
import { PaperClipOutlined, SendOutlined } from '@/uicomponents/icons';
import { Upload } from '@/uicomponents/upload';
import { getAcceptedFileTypes } from '../services';
import { Hideable } from '@/components/shared';
import { COLORS } from '../lib/constants/colors';

interface InputActionsProps {
  isStreaming: boolean;
  canSend: boolean;
  inputDisabled: boolean;
  tenantCode: string | null;
  onSend: () => void;
  onStop: () => void;
  onFilesUpload: (files: File[]) => void;
}

export const InputActions = ({
  isStreaming,
  canSend,
  inputDisabled,
  tenantCode,
  onSend,
  onStop,
  onFilesUpload,
}: InputActionsProps) => {
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
    <>
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

      <Hideable show={isStreaming}>
        <div
          onClick={onStop}
          style={{
            width: '1rem',
            height: '1rem',
            backgroundColor: COLORS.PRIMARY,
            borderRadius: '2px',
            cursor: 'pointer',
            marginBottom: '0.125rem',
          }}
        />
      </Hideable>

      <Hideable show={!isStreaming}>
        <SendOutlined
          onClick={canSend ? onSend : undefined}
          style={{
            fontSize: '1.25rem',
            color: canSend ? COLORS.PRIMARY : '#bfbfbf',
            cursor: canSend ? 'pointer' : 'not-allowed',
            paddingBottom: '0.125rem',
          }}
        />
      </Hideable>
    </>
  );
};
